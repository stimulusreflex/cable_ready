# frozen_string_literal: true

module CableReady
  module Updatable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        include ExtendHasMany

        after_commit CollectionUpdatableCallbacks.new(:create), on: :create
        after_commit CollectionUpdatableCallbacks.new(:update), on: :update
        after_commit CollectionUpdatableCallbacks.new(:destroy), on: :destroy

        def self.enable_updates(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true }
          }.merge(options)

          enabled_operations = Array(options[:on])

          after_commit(ModelUpdatableCallbacks.new(:create, enabled_operations), {on: :create, if: options[:if]})
          after_commit(ModelUpdatableCallbacks.new(:update, enabled_operations), {on: :update, if: options[:if]})
          after_commit(ModelUpdatableCallbacks.new(:destroy, enabled_operations), {on: :destroy, if: options[:if]})
        end

        def self.skip_updates
          skip_updates_classes.push(self)
          yield
        ensure
          skip_updates_classes.pop
        end
      end
    end

    private

    module ClassMethods
      def has_many(name, scope = nil, **options, &extension)
        option = options.delete(:enable_updates)
        broadcast = option.present?
        result = super
        enrich_association_with_updates(name, option) if broadcast
        result
      end

      def has_one(name, scope = nil, **options, &extension)
        option = options.delete(:enable_updates)
        broadcast = option.present?
        result = super
        enrich_association_with_updates(name, option) if broadcast
        result
      end

      def has_many_attached(name, **options)
        option = options.delete(:enable_updates)
        broadcast = option.present?
        result = super
        enrich_attachments_with_updates(name, option) if broadcast
        result
      end

      def cable_ready_collections
        @cable_ready_collections ||= CollectionsRegistry.new
      end

      def cable_ready_update_collection(resource, name, model)
        identifier = resource.to_global_id.to_s + ":" + name.to_s
        broadcast_updates(identifier, model.respond_to?(:previous_changes) ? {changed: model.previous_changes.keys} : {})
      end

      def enrich_association_with_updates(name, option)
        reflection = reflect_on_association(name)

        inverse_of = reflection.inverse_of&.name&.to_s
        through_association = nil

        if reflection.through_reflection?
          inverse_of = reflection.through_reflection.inverse_of&.name&.to_s
          through_association = reflection.through_reflection.name.to_s.singularize
        end

        options = build_options(option)

        reflection.klass.send(:include, CableReady::Updatable) unless reflection.klass.respond_to?(:cable_ready_collections)

        reflection.klass.cable_ready_collections.register({
          klass: self,
          foreign_key: reflection.foreign_key,
          name: name,
          inverse_association: inverse_of,
          through_association: through_association,
          options: options
        })
      end

      def enrich_attachments_with_updates(name, option)
        options = build_options(option)

        ActiveStorage::Attachment.send(:include, CableReady::Updatable) unless ActiveStorage::Attachment.respond_to?(:cable_ready_collections)

        ActiveStorage::Attachment.cable_ready_collections.register({
          klass: self,
          foreign_key: "record_id",
          name: name,
          inverse_association: "record",
          through_association: nil,
          options: options
        })
      end

      def build_options(option)
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
          raise ArgumentError, "Invalid enable_updates option #{option}"
        end

        options
      end

      def broadcast_updates(model_class, options)
        return if skip_updates_classes.any? { |klass| klass >= self }
        ActionCable.server.broadcast(model_class, options)
      end

      def skip_updates_classes
        Thread.current[:skip_updates_classes] ||= []
      end
    end
  end
end
