require "rails/engine"

module CableReady
  class Engine < Rails::Engine
    initializer "cable_ready.sanity_check" do
      SanityChecker.check! unless Rails.env.production?
    end

    initializer "cable_ready.renderer" do
      ActiveSupport.on_load(:action_controller) do
        ActionController::Renderers.add :operations do |operations, options|
          response.content_type ||= Mime[:cable_ready]
          render json: operations.dispatch
        end

        Mime::Type.register "application/vnd.cable-ready.json", :cable_ready
      end
    end

    initializer "cable_ready.assets" do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.precompile += %w[
          cable_ready.js
          cable_ready.min.js
          cable_ready.min.js.map
          cable_ready.umd.js
          cable_ready.umd.min.js
          cable_ready.umd.min.js.map
        ]
      end
    end

    initializer "cable_ready.importmap", before: "importmap" do |app|
      if app.config.respond_to?(:importmap)
        app.config.importmap.cache_sweepers << Engine.root.join("app/assets/javascripts")
      end
    end
  end
end
