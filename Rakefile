# frozen_string_literal: true

require "bundler/gem_tasks"
require "github_changelog_generator/task"

task default: [:test]

task :test do
  puts "Please write some tests..."
end

GitHubChangelogGenerator::RakeTask.new :changelog do |config|
  config.user = "hopsoft"
  config.project = "cable_ready"
end
