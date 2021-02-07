# frozen_string_literal: true

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require "mocha"
require "rails"
require "rails/generators"
require "rails/test_help"
require "minitest/mock"
require "mocha/minitest"
require "pry"

# Load support files
Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].sort.each { |f| require f }
