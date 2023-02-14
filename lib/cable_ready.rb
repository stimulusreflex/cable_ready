# frozen_string_literal: true

require "open-uri"
require "active_support/message_verifier"
require "cable_ready/identifiable"
require "cable_ready/operation_builder"
require "cable_ready/config"
require "cable_ready/broadcaster"
require "cable_ready/engine"
require "cable_ready/sanity_checker"
require "cable_ready/compoundable"
require "cable_ready/channel"
require "cable_ready/channels"
require "cable_ready/cable_car"
require "cable_ready/stream_identifier"
require "cable_ready/version"
require "cable_ready_helper"

module CableReady
  class << self
    def config
      CableReady::Config.instance
    end

    def configure
      yield config
    end

    def signed_stream_verifier
      @signed_stream_verifier ||= ActiveSupport::MessageVerifier.new(config.verifier_key, digest: "SHA256", serializer: JSON)
    end
  end
end
