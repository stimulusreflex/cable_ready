module CableReady
  module Broadcastable
    class CollectionRegistry
      def initialize
        @registered_collections = []
      end

      def register(collection)
        @registered_collections << collection
      end

      def broadcast_for!(model, operation)
        @registered_collections.select { |c| c[:options][:on].include?(operation) }
          .each do |collection|
          resource = find_resource_for_broadcast(collection, model)
          next if resource.nil?

          collection[:klass].cable_ready_broadcast_collection(resource, collection[:name]) if collection[:options][:if].call(resource)
        end
      end

      private

      def find_resource_for_broadcast(collection, model)
        raise ArgumentError, "Could not find inverse_of for #{collection[:name]}" unless collection[:inverse_association]

        resource = model
        resource = resource.send(collection[:through_association].underscore) if collection[:through_association]
        resource.send(collection[:inverse_association].underscore)
      end
    end
  end
end
