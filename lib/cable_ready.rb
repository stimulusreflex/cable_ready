# frozen_string_literal: true

require "rails/engine"
require "active_support/all"
require "cable_ready/version"
require "cable_ready/broadcaster"
require "cable_ready/config"


module CableReady
  class Engine < Rails::Engine
  end

  def self.config
    @config ||= Config.new
  end
end
