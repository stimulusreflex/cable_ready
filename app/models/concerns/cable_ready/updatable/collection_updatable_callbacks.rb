# frozen_string_literal: true

module CableReady
  module Updatable
    class CollectionUpdatableCallbacks
      def initialize(operation)
        @operation = operation
      end

      def after_commit(model)
        update_collections(model)
      end

      private

      def update_collections(model)
        model.class.cable_ready_collections.broadcast_for!(model, @operation)
      end
    end
  end
end
