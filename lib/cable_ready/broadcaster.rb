# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        class_attribute :broadcast_resource_enabled
        after_commit :broadcast_resource_commits, if: -> { self.broadcast_resource_enabled }

        def self.has_many(name, scope = nil, **options, &extension)
          @broadcast_association_commits = options.delete(:broadcast).present?
          result = super
          broadcast_association(name) if @broadcast_association_commits
          result
        end

        def self.broadcast_resource
          self.broadcast_resource_enabled = true
        end

        private

        def self.broadcast_association(name)
          # name is the name of the association, so that's one down...
          # ActionCable.server.broadcast(self.to_gid, {})
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

    def broadcast_resource_commits
      ActionCable.server.broadcast(self.to_gid, {})
    end
  end
end
