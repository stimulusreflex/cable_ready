# frozen_string_literal: true

require "bundler/gem_tasks"
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
