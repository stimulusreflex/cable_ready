# frozen_string_literal: true

require_relative "channels"
require_relative "identifiable"
require_relative "cable_car"

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
  end
end
