# frozen_string_literal: true

require "cable_ready/broadcastable/model_broadcaster_callbacks"
require "cable_ready/broadcastable/collection_broadcaster_callbacks"
require "cable_ready/broadcastable/collections_registry"

module CableReady
  module Broadcastable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany

        after_commit CollectionBroadcasterCallbacks.new(:create), on: :create
        after_commit CollectionBroadcasterCallbacks.new(:update), on: :update
        after_commit CollectionBroadcasterCallbacks.new(:destroy), on: :destroy

        def self.enable_broadcasts(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true }
          }.merge(options)

          enabled_operations = Array(options[:on])

          after_commit(ModelBroadcasterCallbacks.new(:create, enabled_operations), {on: :create, if: options[:if]})
          after_commit(ModelBroadcasterCallbacks.new(:update, enabled_operations), {on: :update, if: options[:if]})
          after_commit(ModelBroadcasterCallbacks.new(:destroy, enabled_operations), {on: :destroy, if: options[:if]})
        end
      end
    end

    private

    module ClassMethods
      def has_many(name, scope = nil, **options, &extension)
        option = options.delete(:broadcast)
        broadcast = option.present?
        result = super
        enrich_association_with_cable_ready_broadcast(name, option) if broadcast
        result
      end

      def cable_ready_collections
        @cable_ready_collections ||= CollectionRegistry.new
      end

      def cable_ready_broadcast_collection(resource, name)
        identifier = resource.to_global_id.to_s + ":" + name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def enrich_association_with_cable_ready_broadcast(name, option)
        reflection = reflect_on_association(name)

        inverse_of = reflection.inverse_of&.name&.to_s
        through_association = nil

        if reflection.through_reflection?
          inverse_of = reflection.through_reflection.inverse_of&.name&.to_s
          through_association = reflection.through_reflection.name.to_s.singularize
        end

        options = {
          on: [:create, :update, :destroy],
          if: ->(resource) { true }
        }

        case option
        when TrueClass
          # proceed!
        when FalseClass
          options[:on] = []
        when Array
          options[:on] = option
        when Symbol
          options[:on] = [option]
        when Hash
          option[:on] = Array(option[:on]) if option[:on]
          options = options.merge!(option)
        when Proc
          options[:if] = option
        else
          raise ArgumentError, "Invalid broadcast option #{option}"
        end

        reflection.klass.send(:include, CableReady::Broadcastable) unless reflection.klass.respond_to?(:cable_ready_collections)

        reflection.klass.cable_ready_collections.register({
          klass: self,
          foreign_key: reflection.foreign_key,
          name: name,
          inverse_association: inverse_of,
          through_association: through_association,
          options: options
        })
      end
    end
  end
end
