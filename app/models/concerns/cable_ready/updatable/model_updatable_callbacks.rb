# frozen_string_literal: true

module CableReady
  module Updatable
    class ModelUpdatableCallbacks
      def initialize(operation, enabled_operations = %i[create update destroy], debounce: CableReady.config.updatable_debounce_time)
        @operation = operation
        @enabled_operations = enabled_operations
        @debounce = debounce
      end

      def after_commit(model)
        return unless @enabled_operations.include?(@operation)

        send("broadcast_#{@operation}", model)
      end

      private

      def broadcast_create(model)
        model.class.send(:broadcast_updates, model.class, {debounce: @debounce})
      end
      alias_method :broadcast_destroy, :broadcast_create

      def broadcast_update(model)
        changeset = model.respond_to?(:previous_changes) ? {changed: model.previous_changes.keys} : {}
        options = changeset.merge({debounce: @debounce})
        model.class.send(:broadcast_updates, model.class, options.dup)
        model.class.send(:broadcast_updates, model.to_global_id, options)
      end
    end
  end
end
