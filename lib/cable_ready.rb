# frozen_string_literal: true

require "rails/engine"
require "open-uri"
require "active_support/all"
require "cable_ready/version"
require "cable_ready/config"
require "cable_ready/broadcaster"
require "cable_ready/sanity_checker"

module CableReady
  class Engine < Rails::Engine
    initializer "cable_ready.sanity_check" do
      SanityChecker.check! unless Rails.env.production?
    end
  end

  def self.config
    CableReady::Config.instance
  end

  def self.configure
    yield config
  end
end
