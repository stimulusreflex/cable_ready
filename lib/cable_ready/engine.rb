module CableReady
  class Engine < Rails::Engine
    initializer "cable_ready.sanity_check" do
      SanityChecker.check! unless Rails.env.production?
    end

    initializer "renderer" do
      ActiveSupport.on_load(:action_controller) do
        ActionController::Renderers.add :operations do |operations, options|
          response.content_type ||= Mime[:cable_ready]
          render json: operations.dispatch
        end

        Mime::Type.register "application/vnd.cable-ready.json", :cable_ready
      end
    end

    initializer "cable_ready.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w[cable_ready.js cable_ready.min.js cable_ready.min.js.map]
      end
    end

    initializer "cable_ready.importmap", before: "importmap" do |app|
      if Rails.application.config.respond_to?(:importmap)
        Rails.application.config.importmap.paths << Engine.root.join("lib/cable_ready/importmap.rb")
        Rails.application.config.importmap.cache_sweepers << Engine.root.join("app/assets/javascripts")
      end
    end
  end
end
