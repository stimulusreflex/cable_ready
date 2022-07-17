# frozen_string_literal: true

require "rails/generators"
require "cable_ready/installer_helper"

module CableReady
  class ConfigGenerator < Rails::Generators::Base
    desc "Creates a CableReady config in app/javascript/config/cable_ready.js"
    source_root File.expand_path("templates", __dir__)

    def create_config
      javascript_path = CableReady::InstallerHelper.javascript_path

      copy_file "app/javascript/config/cable_ready.js"

      if File.exist?(Rails.root.join("#{javascript_path}/config/index.js"))
        append_to_file "#{javascript_path}/config/index.js", 'import "./cable_ready"'
      else
        copy_file "#{javascript_path}/config/index.js"
      end

      if CableReady::InstallerHelper.importmap?
        append_to_file "config/importmap.rb", 'pin_all_from "app/javascript/config", under: "config"'
      end

      if CableReady::InstallerHelper.esbuild?
        copy_file "esbuild.config.js"

        File.rename("#{javascript_path}/controllers/index.js", "#{javascript_path}/controllers/index.original.js")

        copy_file "app/javascript/controllers/index.esbuild.js", "#{javascript_path}/controllers/index.js"
        system 'npm set-script build "node esbuild.config.js"'
      end

      paths = [
        "#{javascript_path}/application.js",
        "#{javascript_path}/application.ts"
      ]

      paths.each do |path|
        if File.exist?(path)
          if CableReady::InstallerHelper.importmap?
            append_to_file path, 'import "config"'
          else
            append_to_file path, 'import "./config"'
          end
        end
      end

      application_js = Rails.root.join("#{javascript_path}/controllers/application.js")

      prepend_to_file application_js, "import consumer from \"../channels/consumer\"\n"
      insert_into_file application_js, "application.consumer = consumer\n", before: "window.Stimulus"
    end
  end
end
