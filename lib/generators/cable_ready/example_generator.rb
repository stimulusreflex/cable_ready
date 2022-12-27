# frozen_string_literal: true

require "rails/generators"
require "cable_ready/version"

module CableReady
  class ExampleGenerator < Rails::Generators::NamedBase
    source_root File.expand_path("templates", __dir__)
    argument :name, type: :string, default: ""
    class_options skip_stimulus: false, skip_reflex: false, timeout: 1, local: false, branch: CableReady::BRANCH

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
      working = Rails.root.join("tmp/cable_ready_installer/working")

      return (source_paths.first + file) if options[:local]

      begin
        tmp_path = working.to_s + file
        url = "https://raw.githubusercontent.com/stimulusreflex/cable_ready/#{options[:branch]}/lib/generators/cable_ready/templates#{file.gsub("%", "%25")}"
        FileUtils.mkdir_p(tmp_path.split("/")[0..-2].join("/"))
        File.write(tmp_path, URI.open(url, open_timeout: options[:timeout].to_i, read_timeout: options[:timeout].to_i).read) # standard:disable Security/Open
        tmp_path
      rescue
        source_paths.first + file
      end
    end
  end
end
