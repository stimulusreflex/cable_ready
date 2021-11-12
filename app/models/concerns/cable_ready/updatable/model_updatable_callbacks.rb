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
        ActionCable.server.broadcast(model.class, {})
      end
      alias_method :broadcast_destroy, :broadcast_create

      def broadcast_update(model)
        ActionCable.server.broadcast(model.class, {})
        ActionCable.server.broadcast(model.to_global_id, model.respond_to?(:previous_changes) ? {changed: model.previous_changes.keys} : {})
      end
    end
  end
end
