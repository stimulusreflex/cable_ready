# frozen_string_literal: true

require "rails/generators"
require "fileutils"

module CableReady
  class StreamFromGenerator < Rails::Generators::Base
    desc "Creates a stream-from Stimulus controller in app/javascript/controllers"
    source_root File.expand_path("templates", __dir__)

    def copy_controller_file
      main_folder = defined?(Webpacker) ? Webpacker.config.source_path.to_s.gsub("#{Rails.root}/", "") : "app/javascript"
      FileUtils.mkdir_p Rails.root.join("#{main_folder}/controllers"), verbose: true

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

      unless lines.find { |line| line.start_with?("import consumer") }
        matches = lines.select { |line| line =~ /\A(require|import)/ }
        lines.insert lines.index(matches.last).to_i + 1, "import consumer from '../channels/consumer'\n"
        File.open(filepath, "w") { |f| f.write lines.join }
      end

      unless lines.find { |line| line.include?("application.consumer = consumer") }
        append_to_file filepath, "application.consumer = consumer"
      end        

      copy_file "app/javascript/controllers/stream_from_controller.js"
    end
  end
end
