# frozen_string_literal: true

module CableReady
  module Broadcastable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany
        after_commit :cable_ready_broadcast_collections
        after_commit :cable_ready_create_callback, on: :create
        after_commit :cable_ready_update_callback, on: :update
        after_commit :cable_ready_destroy_callback, on: :destroy

        def self.enable_broadcasts(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true }
          }.merge(options)

          after_commit(:cable_ready_broadcast_creates, {on: :create, if: options[:if]}) if options[:on].include?(:create)
          after_commit(:cable_ready_broadcast_updates, {on: :update, if: options[:if]}) if options[:on].include?(:update)
          after_commit(:cable_ready_broadcast_destroys, {on: :destroy, if: options[:if]}) if options[:on].include?(:destroy)
        end
      end
    end

    private

    def cable_ready_create_callback
      @cable_ready_current_callback = :create
    end

    def cable_ready_update_callback
      @cable_ready_current_callback = :update
    end

    def cable_ready_destroy_callback
      @cable_ready_current_callback = :destroy
    end

    def cable_ready_broadcast_creates
      ActionCable.server.broadcast(self.class, {})
    end
    alias_method :cable_ready_broadcast_destroys, :cable_ready_broadcast_creates

    def cable_ready_broadcast_updates
      ActionCable.server.broadcast(self.class, {})
      ActionCable.server.broadcast(to_global_id, {})
    end

    def cable_ready_broadcast_collections
      self.class.cable_ready_registered_collections
        .select { |c| c[:options][:on].include?(@cable_ready_current_callback) }
        .each do |collection|
        resource = cable_ready_find_resource_for_broadcast(collection)
        collection[:klass].cable_ready_broadcast_collection(resource, collection[:name]) if collection[:options][:if].call(resource)
      end
    end

    def cable_ready_find_resource_for_broadcast(collection)
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
        cable_ready_broadcast(name, option) if broadcast
        result
      end

      def cable_ready_register_collection(collection)
        @collections ||= []
        @collections << collection
      end

      def cable_ready_registered_collections
        @collections || []
      end

      def cable_ready_broadcast_collection(resource, name)
        identifier = resource.to_global_id.to_s + ":" + name.to_s
        ActionCable.server.broadcast(identifier, {})
      end

      def cable_ready_broadcast(name, option)
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

        reflection.klass.cable_ready_register_collection({
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
