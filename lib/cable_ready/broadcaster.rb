# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany
        class_attribute :broadcast_self_enabled, :broadcast_collections_enabled
        after_commit :broadcast_self, if: -> { broadcast_self_enabled }
        after_commit :broadcast_collections, if: -> { broadcast_collections_enabled }

        def self.enable_broadcast_self
          self.broadcast_self_enabled = true
        end

        def self.enable_broadcast_collections
          self.broadcast_collections_enabled = true
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
        # klass, id, collection, resource = registered_collection
        klass, _, collection = registered_collection
        puts
        puts "*******************"
        puts registered_collection.inspect
        puts "************"
        puts
        klass.broadcast_collection(self, collection)
      end
    end

    module ClassMethods
      def broadcast_collection(resource, collection_name)
        identifier = CableReady.signed_stream_verifier.generate(resource.to_global_id.to_s + ":" + collection_name.to_s)
        ActionCable.server.broadcast(identifier, {})
      end

      # def broadcast(resource, collection_name)
      def broadcast(collection_name)
        reflection = reflect_on_association(collection_name)
        # reflection.klass.register_collection(self, reflection.foreign_key, collection_name, resource)
        reflection.klass.register_collection(self, reflection.foreign_key, collection_name)
      end

      def has_many(name, scope = nil, **options, &extension)
        broadcast = options.delete(:broadcast).present?
        result = super
        # broadcast(self, name) if broadcast
        broadcast(name) if broadcast
        result
      end

      # def register_collection(klass, id, collection, resource)
      def register_collection(klass, id, collection)
        @collections ||= []
        # @collections << [klass, id, collection, resource]
        @collections << [klass, id, collection]
      end

      def registered_collections
        @collections || []
      end
    end
  end
end
