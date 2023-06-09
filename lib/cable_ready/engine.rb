# frozen_string_literal: true

require "rails/engine"

module CableReady
  class Engine < Rails::Engine
    # If you don't want to precompile CableReady's assets (eg. because you're using webpack),
    # you can do this in an initializer:
    #
    # config.after_initialize do
    #   config.assets.precompile -= CableReady::Engine::PRECOMPILE_ASSETS
    # end
    PRECOMPILE_ASSETS = %w[
      cable_ready.js
      cable_ready.umd.js
    ]

    initializer "cable_ready.assets" do |app|
      if app.config.respond_to?(:assets) && CableReady.config.precompile_assets
        app.config.assets.precompile += PRECOMPILE_ASSETS
      end
    end

    initializer "cable_ready.sanity_check" do
      SanityChecker.check! unless Rails.env.production?
    end

    initializer "cable_ready.mimetype" do
      Mime::Type.register "text/vnd.cable-ready.json", :cable_ready
    end

    initializer "cable_ready.renderer" do
      ActiveSupport.on_load(:action_controller) do
        ActionController::Renderers.add :operations do |operations, options|
          warn "DEPRECATED: CableReady's `render operations:` call has been renamed to `render cable_ready:`. Please update your render call."

          response.content_type ||= Mime[:cable_ready]
          response.headers["X-Cable-Ready-Version"] = CableReady::VERSION

          render json: operations.respond_to?(:dispatch) ? operations.dispatch : operations
        end

        ActionController::Renderers.add :cable_ready do |operations, options|
          response.content_type ||= Mime[:cable_ready]
          response.headers["X-Cable-Ready-Version"] = CableReady::VERSION

          render json: operations.respond_to?(:dispatch) ? operations.dispatch : operations
        end
      end
    end

    initializer "cable_ready.importmap", before: "importmap" do |app|
      if app.config.respond_to?(:importmap)
        app.config.importmap.paths << Engine.root.join("lib/cable_ready/importmap.rb")
        app.config.importmap.cache_sweepers << Engine.root.join("app/assets/javascripts")
      end
    end

    config.after_initialize do
      CableReady.config.updatable_debounce_adapter ||= CableReady::Updatable::MemoryCacheDebounceAdapter.instance
    end
  end
end
