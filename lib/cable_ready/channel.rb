# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :identifier, :enqueued_operations

    def initialize(identifier)
      @identifier = identifier
      reset
      CableReady.config.operation_names.each { |name| add_operation_method name }

      config_observer = self
      CableReady.config.add_observer config_observer, :add_operation_method
      ObjectSpace.define_finalizer self, -> { CableReady.config.delete_observer config_observer }
    end

    def broadcast(clear: true)
      ActionCable.server.broadcast identifier, {"cableReady" => true, "operations" => broadcastable_operations}
      reset if clear
    end

    def broadcast_to(model, clear: true)
      identifier.broadcast_to model, {"cableReady" => true, "operations" => broadcastable_operations}
      reset if clear
    end

    def add_operation_method(name)
      return if respond_to?(name)
      singleton_class.public_send :define_method, name, ->(options = {}) {
        enqueued_operations[name.to_s] << options.stringify_keys
        self # supports operation chaining
      }
    end

    private

    def reset
      @enqueued_operations = Hash.new { |hash, key| hash[key] = [] }
    end

    def broadcastable_operations
      enqueued_operations
        .select { |_, list| list.present? }
        .deep_transform_keys! { |key| key.to_s.camelize(:lower) }
    end
  end
end
