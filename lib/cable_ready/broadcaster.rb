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
      self.class.registered_collections.each do |collection|
        resource = find_resource_for_broadcast(collection)
        collection[:klass].broadcast_collection(resource, collection[:name])
      end
    end

    def find_resource_for_broadcast(collection)
      resource = self
      resource = resource.send(collection[:through_association].underscore) if collection[:through_association]
      resource.send(collection[:inverse_association].underscore)
    end

    module ClassMethods
      def broadcast_collection(resource, name)
        identifier = resource.to_global_id.to_s + ":" + name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def broadcast(name)
        reflection = reflect_on_association(name)

        inverse_of = reflection.inverse_of&.name&.to_s
        through_association = nil

        if reflection.through_reflection?
          inverse_of = reflection.through_reflection.inverse_of&.name&.to_s
          through_association = reflection.through_reflection.name.to_s.singularize
        end

        raise ArgumentError, "Could not find inverse_of for #{name}" unless inverse_of

        reflection.klass.register_collection({ 
          klass: self,
          foreign_key: reflection.foreign_key,
          name: name,
          inverse_association: inverse_of,
          through_association: through_association
        })
      end

      def has_many(name, scope = nil, **options, &extension)
        broadcast = options.delete(:broadcast).present?
        result = super
        broadcast(name) if broadcast
        result
      end

      def register_collection(collection)
        @collections ||= []
        @collections << collection
      end

      def registered_collections
        @collections || []
      end
    end
  end
end
