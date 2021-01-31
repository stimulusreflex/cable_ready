# frozen_string_literal: true

require "rails/generators"

module CableReady
  class InitializerGenerator < Rails::Generators::Base
    desc "Creates a CableReady initializer template in config/initializers"
    source_root File.expand_path("templates", __dir__)

    def copy_initializer_file
      copy_file "config/initializers/cable_ready.rb"
    end
  end
end
