# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany
        class_attribute :broadcast_self_enabled
        after_commit :broadcast_self, if: -> { broadcast_self_enabled }
        after_commit :broadcast_collections

        def self.enable_broadcasts
          self.broadcast_self_enabled = true
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
        klass, _, collection, inverse_association = registered_collection
        resource = self.send(inverse_association.underscore)
        klass.broadcast_collection(resource, collection)
      end
    end

    module ClassMethods
      def broadcast_collection(resource, collection_name)
        identifier = resource.to_global_id.to_s + ":" + collection_name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def broadcast(collection_name)
        reflection = reflect_on_association(collection_name)
        reflection.klass.register_collection(self, reflection.foreign_key, collection_name, reflection.inverse_of.name.to_s)
      end

      def has_many(name, scope = nil, **options, &extension)
        broadcast = options.delete(:broadcast).present?
        result = super
        broadcast(name) if broadcast
        result
      end

      def register_collection(klass, foreign_key, collection, inverse_association)
        @collections ||= []
        @collections << [klass, foreign_key, collection, inverse_association]
      end

      def registered_collections
        @collections || []
      end
    end
  end
end