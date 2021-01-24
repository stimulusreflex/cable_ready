# frozen_string_literal: true

require "rails/engine"
require "active_support/all"
require "cable_ready/version"
require "cable_ready/config"
require "cable_ready/broadcaster"

module CableReady
  class Engine < Rails::Engine
  end

  def self.config
    CableReady::Config.instance
  end

  def self.configure
    yield config
  end
end
