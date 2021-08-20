# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany
        after_commit :broadcast_collections

        def self.enable_broadcasts(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true }
          }.merge(options)
          after_commit :broadcast_self, options
        end
      end
    end

    def cable_ready
      CableReady::Channels.instance
    end

    def cable_car
      CableReady::CableCar.instance
    end

    private

    def broadcast_self
      ActionCable.server.broadcast(to_global_id, {})
    end

    def broadcast_collections
      self.class.registered_collections.each do |registered_collection|
        klass, _, collection_name, _, _ = registered_collection # TODO: Maybe this should be a Hash?
        resource = find_resource_for_broadcast(registered_collection)
        klass.broadcast_collection(resource, collection_name)
      end
    end

    def find_resource_for_broadcast(registered_collection)
      resource = self
      _, _, _, inverse_association, through_association = registered_collection

      if through_association
        resource = resource.send(through_association.underscore)
      end

      resource.send(inverse_association.underscore)
    end

    module ClassMethods
      def broadcast_collection(resource, collection_name)
        identifier = resource.to_global_id.to_s + ":" + collection_name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def broadcast(collection_name)
        reflection = reflect_on_association(collection_name)

        inverse_of = reflection.inverse_of&.name&.to_s
        through_association = nil

        if reflection.through_reflection?
          inverse_of = reflection.through_reflection.inverse_of.name.to_s
          through_association = reflection.through_reflection.name.to_s.singularize
        end

        # TODO: If we can't find inverse_of for some reason we need to abort.

        reflection.klass.register_collection(self, reflection.foreign_key, collection_name, inverse_of, through_association)
      end

      def has_many(name, scope = nil, **options, &extension)
        broadcast = options.delete(:broadcast).present?
        result = super
        broadcast(name) if broadcast
        result
      end

      def register_collection(klass, foreign_key, collection, inverse_association, through_association)
        @collections ||= []
        @collections << [klass, foreign_key, collection, inverse_association, through_association]
      end

      def registered_collections
        @collections || []
      end
    end
  end
end
