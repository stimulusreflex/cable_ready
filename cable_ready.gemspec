require File.expand_path("../lib/cable_ready/version", __FILE__)

Gem::Specification.new do |gem|
  gem.name = "cable_ready"
  gem.license = "MIT"
  gem.version = CableReady::VERSION
  gem.authors = ["Nathan Hopkins"]
  gem.email = ["natehop@gmail.com"]
  gem.homepage = "https://github.com/hopsoft/cable_ready"
  gem.summary = "Out-of-Band Server Triggered DOM Operations"

  gem.files = Dir["lib/**/*.rb", "app/assets/javascripts/cable_ready.js", "bin/*", "[A-Z]*"]
  gem.test_files = Dir["test/**/*.rb"]

  gem.add_dependency "rails", ">= 5.2"

  gem.add_development_dependency "rake"
  gem.add_development_dependency "standardrb"
  gem.add_development_dependency "pry"
  gem.add_development_dependency "pry-nav"
end
