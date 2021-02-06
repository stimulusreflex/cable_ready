# frozen_string_literal: true

require_relative "channels"
require_relative "identifiable"

module CableReady
  module Broadcaster
    include Identifiable
    extend ::ActiveSupport::Concern

    def cable_ready
      CableReady::Channels.instance
    end
  end
end
