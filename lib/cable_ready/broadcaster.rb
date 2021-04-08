# frozen_string_literal: true

require_relative "channels"
require_relative "cable_car"

module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    def cable_ready
      CableReady::Channels.instance
    end

    def cable_car
      CableReady::CableCar.instance
    end

    def dom_id(record, prefix = nil)
      "##{ActionView::RecordIdentifier.dom_id(record, prefix)}"
    end
  end
end
