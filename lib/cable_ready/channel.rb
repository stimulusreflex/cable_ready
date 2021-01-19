# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :identifier, :operations, :available_operations

    def initialize(identifier, available_operations)
      @identifier = identifier
      @available_operations = available_operations
      reset
      available_operations.each do |available_operation, implementation|
        define_singleton_method available_operation, &implementation
      end
    end

    def channel_broadcast(clear)
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast identifier, {"cableReady" => true, "operations" => operations}
      reset if clear
    end

    def channel_broadcast_to(model, clear)
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      identifier.broadcast_to model, {"cableReady" => true, "operations" => operations}
      reset if clear
    end

    def broadcast(clear = true)
      CableReady::Channels.instance.broadcast(identifier, clear: clear)
    end

    def broadcast_to(model, clear = true)
      CableReady::Channels.instance.broadcast_to(model, identifier, clear: clear)
    end

    # @param serialized_operations [String] a serialization string generated with
    #   CableReady::OperationsSerializer
    # @example apply(CableReady::OperationSerializer.new([morph: {selector: "#foo", ...}])
    #   .verified)
    # @raise [ActiveSupport::MessageVerifier::InvalidSignature] if the passed
    #   serialized string is invalid
    def apply(serialized_operations)
      verified_operations = CableReady::MessageVerifier.message_verifier.verify(serialized_operations)

      verified_operations.each do |operation|
        key, options = operation.to_a.first
        enqueue_operation(key, options)
      end

      self
    end

    private

    def enqueue_operation(key, options)
      operations[key] << options
      self
    end

    def reset
      @operations = Hash.new { |hash, operation| hash[operation] = [] }
    end
  end
end
