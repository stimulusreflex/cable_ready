# frozen_string_literal: true

require_relative "channels"

module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    def cable_ready
      @cable_ready_channels ||= CableReady::Channels.new
    end

    def dom_id(record, prefix = nil)
      "##{ActionView::RecordIdentifier.dom_id(record, prefix)}"
    end
  end
end
