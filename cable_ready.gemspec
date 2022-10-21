# frozen_string_literal: true

require File.expand_path("lib/cable_ready/version", __dir__)

Gem::Specification.new do |gem|
  gem.name = "cable_ready"
  gem.license = "MIT"
  gem.version = CableReady::VERSION
  gem.authors = ["Nathan Hopkins"]
  gem.email = ["natehop@gmail.com"]
  gem.homepage = "https://github.com/stimulusreflex/cable_ready"
  gem.summary = "Out-of-Band Server Triggered DOM Operations"

  gem.files = Dir[
    "lib/**/*.{rb,rake}",
    "app/**/*.rb",
    "app/assets/javascripts/*",
    "bin/*",
    "[A-Z]*"
  ]

  gem.test_files = Dir["test/**/*.rb"]

  gem.required_ruby_version = ">= 2.7.0"

  rails_version = ">= 6.0"

  gem.add_dependency "actioncable", rails_version
  gem.add_dependency "thread-local", ">= 1.1.0"

  gem.add_development_dependency "magic_frozen_string_literal"
  gem.add_development_dependency "mocha"
  gem.add_development_dependency "pry"
  gem.add_development_dependency "pry-nav"
  gem.add_development_dependency "rails", rails_version
  gem.add_development_dependency "rake"
  gem.add_development_dependency "sqlite3"
  gem.add_development_dependency "standardrb"
end
