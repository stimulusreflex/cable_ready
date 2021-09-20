module CableReady
  module Broadcastable
    class CollectionBroadcasterCallbacks
      def initialize(operation)
        @operation = operation
      end

      def after_commit(model)
        broadcast_collections(model)
      end

      private

      def broadcast_collections(model)
        model.class.cable_ready_collections.broadcast_for!(model, @operation)
      end
    end
  end
end
