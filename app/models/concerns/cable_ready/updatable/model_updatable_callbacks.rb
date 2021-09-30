module CableReady
  module Updatable
    class ModelUpdatableCallbacks
      extend Debouncer::Debounceable

      debounce :attempt_broadcast, 0.02, grouped: true

      def initialize(operation, enabled_operations = %i[create update destroy])
        @operation = operation
        @enabled_operations = enabled_operations
      end

      def after_commit(model)
        return unless @enabled_operations.include?(@operation)

        send("broadcast_#{@operation}", model)
      end

      def attempt_broadcast(identifier)
        ActionCable.server.broadcast(identifier, {})
      end

      private

      def broadcast_create(model)
        attempt_broadcast model.class
      end
      alias_method :broadcast_destroy, :broadcast_create

      def broadcast_update(model)
        attempt_broadcast model.class
        attempt_broadcast model.to_global_id
      end
    end
  end
end
