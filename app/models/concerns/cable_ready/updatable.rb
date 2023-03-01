# frozen_string_literal: true

require "active_support/concern"

module CableReady
  module Updatable
    extend ::ActiveSupport::Concern

    class MemoryDebounceAdapter
      include Singleton
      include MonitorMixin

      delegate_missing_to :@dict

      def initialize
        super
        @dict = {}
      end

      def []=(key, value)
        synchronize do
          @dict[key] = value
        end
      end

      def [](key)
        synchronize do
          @dict[key]
        end
      end
    end

    mattr_accessor :debounce_adapter, default: MemoryDebounceAdapter.instance

    included do |base|
      if defined?(ActiveRecord) && base < ActiveRecord::Base
        include ExtendHasMany

        after_commit CollectionUpdatableCallbacks.new(:create), on: :create
        after_commit CollectionUpdatableCallbacks.new(:update), on: :update
        after_commit CollectionUpdatableCallbacks.new(:destroy), on: :destroy

        def self.enable_updates(...)
          warn "DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` class method will be removed from a future version of CableReady 5"

          enable_cable_ready_updates(...)
        end

        def self.skip_updates(...)
          warn "DEPRECATED: please use `skip_cable_ready_updates` instead. The `skip_updates` class method will be removed from a future version of CableReady 5"

          skip_cable_ready_updates(...)
        end

        def self.enable_cable_ready_updates(*options)
          options = options.extract_options!
          options = {
            on: [:create, :update, :destroy],
            if: -> { true },
            debounce: CableReady.config.updatable_debounce_time
          }.merge(options)

          enabled_operations = Array(options[:on])

          @debounce_time = options[:debounce]

          after_commit(ModelUpdatableCallbacks.new(:create, enabled_operations), {on: :create, if: options[:if]})
          after_commit(ModelUpdatableCallbacks.new(:update, enabled_operations), {on: :update, if: options[:if]})
          after_commit(ModelUpdatableCallbacks.new(:destroy, enabled_operations), {on: :destroy, if: options[:if]})
        end

        def self.skip_cable_ready_updates
          skip_updates_classes.push(self)
          yield
        ensure
          skip_updates_classes.pop
        end
      end
    end

    private

    module ClassMethods
      include Compoundable

      def has_many(name, scope = nil, **options, &extension)
        option = if options.has_key?(:enable_updates)
          warn "DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` option will be removed from a future version of CableReady 5"
          options.delete(:enable_updates)
        else
          options.delete(:enable_cable_ready_updates)
        end

        descendants = options.delete(:descendants)

        broadcast = option.present?
        result = super
        enrich_association_with_updates(name, option, descendants) if broadcast
        result
      end

      def has_one(name, scope = nil, **options, &extension)
        option = if options.has_key?(:enable_updates)
          warn "DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` option will be removed from a future version of CableReady 5"
          options.delete(:enable_updates)
        else
          options.delete(:enable_cable_ready_updates)
        end

        descendants = options.delete(:descendants)

        broadcast = option.present?
        result = super
        enrich_association_with_updates(name, option, descendants) if broadcast
        result
      end

      def has_many_attached(name, **options)
        raise("ActiveStorage must be enabled to use has_many_attached") unless defined?(ActiveStorage)

        option = if options.has_key?(:enable_updates)
          warn "DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` option will be removed from a future version of CableReady 5"
          options.delete(:enable_updates)
        else
          options.delete(:enable_cable_ready_updates)
        end

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

      def enrich_association_with_updates(name, option, descendants = nil)
        reflection = reflect_on_association(name)

        inverse_of = reflection.inverse_of&.name&.to_s
        through_association = nil

        if reflection.through_reflection?
          inverse_of = reflection.through_reflection.inverse_of&.name&.to_s
          through_association = reflection.through_reflection.name.to_s.singularize
        end

        options = build_options(option)

        [reflection.klass, *descendants&.map(&:to_s)&.map(&:constantize)].each do |klass|
          klass.send(:include, CableReady::Updatable) unless klass.respond_to?(:cable_ready_collections)
          klass.cable_ready_collections.register({
            klass: self,
            foreign_key: reflection.foreign_key,
            name: name,
            inverse_association: inverse_of,
            through_association: through_association,
            options: options
          })
        end
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
          raise ArgumentError, "Invalid enable_cable_ready_updates option #{option}"
        end

        options
      end

      def broadcast_updates(model_class, options)
        return if skip_updates_classes.any? { |klass| klass >= self }
        raise("ActionCable must be enabled to use Updatable") unless defined?(ActionCable)

        if debounce_time > 0.seconds
          key = compound([model_class, *options])
          old_wait_until = CableReady::Updatable.debounce_adapter[key]
          now = Time.now.to_f

          if old_wait_until.nil? || old_wait_until < now
            new_wait_until = now + debounce_time.to_f
            CableReady::Updatable.debounce_adapter[key] = new_wait_until
            ActionCable.server.broadcast(model_class, options)
          end
        else
          ActionCable.server.broadcast(model_class, options)
        end
      end

      def debounce_time
        @debounce_time ||= CableReady.config.updatable_debounce_time
      end

      def skip_updates_classes
        Thread.current[:skip_updates_classes] ||= []
      end
    end
  end
end
