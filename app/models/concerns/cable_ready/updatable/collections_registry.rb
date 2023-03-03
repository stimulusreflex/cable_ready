# frozen_string_literal: true

module CableReady
  module Updatable
    Collection = Struct.new(
      :klass,
      :name,
      :reflection,
      :options,
      :foreign_key,
      :inverse_association,
      :through_association,
      :debounce_time,
      keyword_init: true
    )

    class CollectionsRegistry
      def initialize
        @registered_collections = []
      end

      def register(collection)
        @registered_collections << collection
      end

      def broadcast_for!(model, operation)
        @registered_collections.select { |c| c.options[:on].include?(operation) }
          .each do |collection|
          resource = find_resource_for_update(collection, model)
          next if resource.nil?

          collection.klass.cable_ready_update_collection(resource, collection.name, model, debounce: collection.debounce_time) if collection.options[:if].call(resource)
        end
      end

      private

      def find_resource_for_update(collection, model)
        collection.reflection ||= collection.klass.reflect_on_association(collection.name)

        collection.foreign_key ||= collection.reflection&.foreign_key

        # lazy load and store through and inverse associations
        if collection.reflection&.through_reflection?
          collection.inverse_association ||= collection.reflection&.through_reflection&.inverse_of&.name&.to_s
          collection.through_association = collection.reflection&.through_reflection&.name&.to_s&.singularize
        else
          collection.inverse_association ||= collection.reflection&.inverse_of&.name&.to_s
        end

        raise ArgumentError, "Could not find inverse_of for #{collection.name}" unless collection.inverse_association

        resource = model
        resource = resource.send(collection.through_association.underscore) if collection.through_association
        resource.send(collection.inverse_association.underscore)
      end
    end
  end
end
