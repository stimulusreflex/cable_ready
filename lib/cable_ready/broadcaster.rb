# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    included do |base|
      if base < ActiveRecord::Base
        after_commit :broadcast_resource

        def self.has_many(name, scope = nil, **options, &extension)
          broadcast = options.delete(:broadcast).present?
          result = super
          broadcast_association(name) if broadcast
          result
        end

        private

        def self.broadcast_association(name)
          # name is the name of the association, so that's one down...
          ActionCable.server.broadcast(self.to_gid, {})
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

    def broadcast_resource
      ActionCable.server.broadcast(self.to_gid, {})
    end
  end
end
