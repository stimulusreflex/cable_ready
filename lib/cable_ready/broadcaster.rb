# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        after_commit :broadcast_self
      end
    end

    class_methods do |base|
      if base < ActiveRecord::Base
        def has_many(*args, &block)
          options = args.extract_options!
          options[:extend] = Array(options[:extend]).push(ClassMethods)
          super(*args, **options, &block)
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
      ActionCable.server.broadcast("#{self.class.name.underscore}_#{id}", {})
    end

    module ClassMethods
      def broadcast_collection(id, collection_name)
        ActionCable.server.broadcast("#{name.underscore}_#{id}_#{collection_name}", {})
      end
    end
  end
end
