# coding: utf-8
require File.expand_path("../lib/cable_ready/version", __FILE__)

Gem::Specification.new do |gem|
  gem.name        = "cable_ready"
  gem.license     = "MIT"
  gem.version     = CableReady::VERSION
  gem.authors     = ["Nathan Hopkins"]
  gem.email       = ["natehop@gmail.com"]
  gem.homepage    = "https://github.com/hopsoft/cable_ready"
  gem.summary     = "put something here"

  gem.files       = Dir["lib/**/*.rb", "vendor/**/*", "bin/*", "[A-Z]*"]
  gem.test_files  = Dir["test/**/*.rb"]

  gem.add_dependency "activesupport", ">= 5.0.0"

  gem.add_development_dependency "rake"
  gem.add_development_dependency "pry-test"
  gem.add_development_dependency "coveralls"
  gem.add_development_dependency "sinatra"
end
