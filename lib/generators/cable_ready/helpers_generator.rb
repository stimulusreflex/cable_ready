# frozen_string_literal: true

require "rails/generators"
require "fileutils"

module CableReady
  class HelpersGenerator < Rails::Generators::Base
    desc "Initializes CableReady with a reference to the shared ActionCable consumer"
    source_root File.expand_path("templates", __dir__)

    def copy_controller_file
      main_folder = defined?(Webpacker) ? Webpacker.config.source_path.to_s.gsub("#{Rails.root}/", "") : "app/javascript"

      filepath = [
        "#{main_folder}/controllers/index.js",
        "#{main_folder}/controllers/index.ts",
        "#{main_folder}/packs/application.js",
        "#{main_folder}/packs/application.ts"
      ]
        .select { |path| File.exist?(path) }
        .map { |path| Rails.root.join(path) }
        .first

      lines = File.open(filepath, "r") { |f| f.readlines }

      unless lines.find { |line| line.start_with?("import CableReady") }
        matches = lines.select { |line| line =~ /\A(require|import)/ }
        lines.insert lines.index(matches.last).to_i + 1, "import CableReady from 'cable_ready'\n"
        File.write(filepath, lines.join)
      end

      unless lines.find { |line| line.start_with?("import consumer") }
        matches = lines.select { |line| line =~ /\A(require|import)/ }
        lines.insert lines.index(matches.last).to_i + 1, "import consumer from '../channels/consumer'\n"
        File.write(filepath, lines.join)
      end

      unless lines.find { |line| line.include?("CableReady.initialize({ consumer })") }
        append_to_file filepath, "CableReady.initialize({ consumer })"
      end
    end
  end
end
