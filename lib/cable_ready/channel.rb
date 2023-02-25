# frozen_string_literal: true

module CableReady
  class Channel < OperationBuilder
    attr_reader :identifier

    def broadcast(clear: true)
      raise("Action Cable must be enabled to use broadcast") unless defined?(ActionCable)
      clients_received = ActionCable.server.broadcast identifier, {
        "cableReady" => true,
        "operations" => operations_payload,
        "version" => CableReady::VERSION
      }
      reset! if clear
      clients_received
    end

    def broadcast_to(model, clear: true)
      raise("Action Cable must be enabled to use broadcast_to") unless defined?(ActionCable)
      clients_received = identifier.broadcast_to model, {
        "cableReady" => true,
        "operations" => operations_payload,
        "version" => CableReady::VERSION
      }
      reset! if clear
      clients_received
    end

    def broadcast_later(clear: true, queue: nil)
      raise("Action Cable must be enabled to use broadcast_later") unless defined?(ActionCable)
      CableReady::BroadcastJob
        .set(queue: queue ? queue.to_sym : CableReady.config.broadcast_job_queue)
        .perform_later(identifier: identifier, operations: operations_payload)
      reset! if clear
    end

    def broadcast_later_to(model, clear: true, queue: nil)
      raise("Action Cable must be enabled to use broadcast_later_to") unless defined?(ActionCable)
      CableReady::BroadcastJob
        .set(queue: queue ? queue.to_sym : CableReady.config.broadcast_job_queue)
        .perform_later(identifier: identifier.name, operations: operations_payload, model: model)
      reset! if clear
    end
  end
end
