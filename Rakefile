# frozen_string_literal: true

require "bundler/gem_tasks"
require "github_changelog_generator/task"
require "rake/testtask"
require "pry"

task default: [:test]

Rake::TestTask.new(:test) do |t|
  t.libs << "lib"
  t.libs << "test"
  t.pattern = "test/**/*_test.rb"
  t.verbose = true
  t.warning = false
end

GitHubChangelogGenerator::RakeTask.new :changelog do |config|
  config.user = "hopsoft"
  config.project = "cable_ready"
end
