# frozen_string_literal: true

require "cable_ready/installer"

proceed = if CableReady::Installer.options.key? "broadcaster"
  CableReady::Installer.options["broadcaster"]
else
  !no?("✨ Make CableReady::Broadcaster available to channels, controllers, jobs and models? (Y/n)")
end

unless proceed
  CableReady::Installer.complete_step :broadcaster

  puts "⏩ Skipping."
  return
end

# include CableReady::Broadcaster in Action Cable Channel classes
channel_path = Rails.root.join("app/channels/application_cable/channel.rb")
if channel_path.exist?
  lines = channel_path.readlines
  if !lines.index { |line| line =~ /^\s*include CableReady::Broadcaster/ }
    CableReady::Installer.backup(channel_path) do
      index = lines.index { |line| line.include?("class Channel < ActionCable::Channel::Base") }
      lines.insert index + 1, "    include CableReady::Broadcaster\n"
      channel_path.write lines.join
    end

    puts "✅ include CableReady::Broadcaster in Action Cable channels"
  else
    puts "⏩  already included CableReady::Broadcaster in Action Cable channels. Skipping"
  end
end

# include CableReady::Broadcaster in Action Controller classes
controller_path = Rails.root.join("app/controllers/application_controller.rb")
if controller_path.exist?
  lines = controller_path.readlines
  if !lines.index { |line| line =~ /^\s*include CableReady::Broadcaster/ }
    CableReady::Installer.backup(controller_path) do
      index = lines.index { |line| line.include?("class ApplicationController < ActionController::Base") }
      lines.insert index + 1, "  include CableReady::Broadcaster\n"
      controller_path.write lines.join
    end

    puts "✅ include CableReady::Broadcaster in Action Controller classes"
  else
    puts "⏩  already included CableReady::Broadcaster in Action Controller classes. Skipping"
  end
end

# include CableReady::Broadcaster in Active Job classes, if present
if defined?(ActiveJob)
  job_path = Rails.root.join("app/jobs/application_job.rb")
  if job_path.exist?
    lines = job_path.readlines
    if !lines.index { |line| line =~ /^\s*include CableReady::Broadcaster/ }
      CableReady::Installer.backup(job_path) do
        index = lines.index { |line| line.include?("class ApplicationJob < ActiveJob::Base") }
        lines.insert index + 1, "  include CableReady::Broadcaster\n"
        job_path.write lines.join
      end

      puts "✅ include CableReady::Broadcaster in Active Job classes"
    else
      puts "⏩  already included CableReady::Broadcaster in Active Job classes. Skipping"
    end
  end
else
  puts "⏩ Active Job not available. Skipping."
end

# include CableReady::Broadcaster in StateMachines, if present
if defined?(StateMachines)
  lines = CableReady::Installer.action_cable_initializer_working_path.read
  if !lines.include?("StateMachines::Machine.prepend(CableReady::Broadcaster)")
    inject_into_file CableReady::Installer.action_cable_initializer_working_path, after: "CableReady.configure do |config|\n", verbose: false do
      <<-RUBY

  StateMachines::Machine.prepend(CableReady::Broadcaster)

      RUBY
    end

    puts "✅ prepend CableReady::Broadcaster into StateMachines::Machine"
  else
    puts "⏩  already prepended CableReady::Broadcaster into StateMachines::Machine. Skipping"
  end
else
  puts "⏩ StateMachines not available. Skipping."
end

# include CableReady::Broadcaster in Active Record model classes
if Rails.root.join(CableReady::Installer.application_record_path).exist?
  lines = CableReady::Installer.application_record_path.readlines
  if !lines.index { |line| line =~ /^\s*include CableReady::Broadcaster/ }
    CableReady::Installer.backup(CableReady::Installer.application_record_path) do
      index = lines.index { |line| line.include?("class ApplicationRecord < ActiveRecord::Base") }
      lines.insert index + 1, "  include CableReady::Broadcaster\n"
      CableReady::Installer.application_record_path.write lines.join
    end

    puts "✅ include CableReady::Broadcaster in Active Record model classes"
  else
    puts "⏩  already included CableReady::Broadcaster in Active Record model classes. Skipping"
  end
end

CableReady::Installer.complete_step :broadcaster
