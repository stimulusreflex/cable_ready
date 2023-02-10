# frozen_string_literal: true

require "rails/generators"
require "cable_ready/version"

module CableReady
  class ExampleGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("templates", __dir__)
    argument :name, type: :string, default: ""
    class_options skip_stimulus: false, skip_reflex: false, timeout: 1, local: false

    def execute
      controller_src = fetch("/app/controllers/examples_controller.rb.tt")
      controller_path = Rails.root.join("app/controllers/examples_controller.rb")
      template(controller_src, controller_path)

      view_src = fetch("/app/views/examples/show.html.erb.tt")
      view_path = Rails.root.join("app/views/examples/show.html.erb")
      template(view_src, view_path)

      example_path = Rails.root.join("app/views/examples")
      FileUtils.remove_dir(example_path) if behavior == :revoke && example_path.exist? && Dir.empty?(example_path)

      route "resource :example, constraints: -> { Rails.env.development? }"

      importmap_path = Rails.root.join("config/importmap.rb")
      if importmap_path.exist?
        importmap = importmap_path.read
        if behavior == :revoke
          if importmap.include?("pin \"fireworks-js\"")
            importmap_path.write importmap_path.readlines.reject { |line| line.include?("pin \"fireworks-js\"") }.join
            say "✅ unpin fireworks-js"
          end
        elsif !importmap.include?("pin \"fireworks-js\"")
          append_file(importmap_path, <<~RUBY, verbose: false)
            pin "fireworks-js", to: "https://ga.jspm.io/npm:fireworks-js@2.10.0/dist/index.es.js"
          RUBY
          say "✅ pin fireworks-js"
        end
      end
    end

    private

    def fetch(file)
      source_paths.first + file
    end
  end
end
