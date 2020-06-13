# frozen_string_literal: true

require_relative "channels"

module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    def cable_ready
      CableReady::Channels.instance
    end

    def dom_id(record, prefix = nil)
      "##{ActionView::RecordIdentifier.dom_id(record, prefix)}"
    end
  end
end
