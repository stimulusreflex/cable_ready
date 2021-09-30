module CableReady
  module Updatable
    class ModelUpdatableCallbacks
      def initialize(operation, enabled_operations = %i[create update destroy])
        @operation = operation
        @enabled_operations = enabled_operations
      end

      def after_commit(model)
        return unless @enabled_operations.include?(@operation)

        send("broadcast_#{@operation}", model)
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

      def attempt_broadcast(identifier)
        @debouncer.group(identifier).call identifier
      end
    end
  end
end
