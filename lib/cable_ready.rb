# frozen_string_literal: true

require "rails/engine"
require "open-uri"
require "active_record"
require "action_view"
require "active_support/all"
require "thread/local"
require "monitor"
require "observer"
require "singleton"
require "cable_ready/version"
require "cable_ready/identifiable"
require "cable_ready/operation_builder"
require "cable_ready/config"
require "cable_ready/broadcaster"
require "cable_ready/sanity_checker"
require "cable_ready/channel"
require "cable_ready/channels"
require "cable_ready/cable_car"

module CableReady
  class Engine < Rails::Engine
    initializer "cable_ready.sanity_check" do
      SanityChecker.check! unless Rails.env.production?
    end

    initializer "renderer" do
      ActiveSupport.on_load(:action_controller) do
        ActionController::Renderers.add :operations do |operations, options|
          render json: operations.dispatch
        end
      end
    end
  end

  def self.config
    CableReady::Config.instance
  end

  def self.configure
    yield config
  end
end
