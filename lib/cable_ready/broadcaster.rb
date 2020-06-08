# frozen_string_literal: true

require_relative "channels"

module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    def cable_ready
      @cable_ready_channels ||= CableReady::Channels.new
    end
  end
end
