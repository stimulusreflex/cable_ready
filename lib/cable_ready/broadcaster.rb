# frozen_string_literal: true

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    def cable_ready
      CableReady::Channels.instance
    end

    def cable_car
      CableReady::CableCar.instance
    end

    def cable_ready_tag(cable_instance)
      cable_instance.dispatch(element: true)
    end
  end
end
