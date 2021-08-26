# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany
        after_commit :broadcast_collections
        after_create_commit { @cable_ready_current_callback = :create }
        after_update_commit { @cable_ready_current_callback = :update }
        after_destroy_commit { @cable_ready_current_callback = :destroy }

        def self.enable_broadcasts(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true }
          }.merge(options)

          @@cable_ready_broadcast_class = options[:broadcast_class]
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
      ActionCable.server.broadcast(self.class, {}) if @@cable_ready_broadcast_class
      ActionCable.server.broadcast(to_global_id, {})
    end

    def broadcast_collections
      self.class.registered_collections
        .select { |c| c[:options][:on].include?(@cable_ready_current_callback) }
        .each do |collection|
        resource = find_resource_for_broadcast(collection)
        collection[:klass].broadcast_collection(resource, collection[:name]) if collection[:options][:if].call(resource)
      end
    end

    def find_resource_for_broadcast(collection)
      raise ArgumentError, "Could not find inverse_of for #{collection[:name]}" unless collection[:inverse_association]

      resource = self
      resource = resource.send(collection[:through_association].underscore) if collection[:through_association]
      resource.send(collection[:inverse_association].underscore)
    end

    module ClassMethods
      def has_many(name, scope = nil, **options, &extension)
        option = options.delete(:broadcast)
        broadcast = option.present?
        result = super
        broadcast(name, option) if broadcast
        result
      end

      def register_collection(collection)
        @collections ||= []
        @collections << collection
      end

      def registered_collections
        @collections || []
      end

      def broadcast_collection(resource, name)
        identifier = resource.to_global_id.to_s + ":" + name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def broadcast(name, option)
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

        reflection.klass.register_collection({
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
