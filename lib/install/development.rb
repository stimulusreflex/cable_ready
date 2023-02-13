# frozen_string_literal: true

require "cable_ready/installer"

# mutate working copy of development.rb to avoid bundle alerts
FileUtils.cp(development_path, development_working_path)

# add default_url_options to development.rb for Action Mailer
if defined?(ActionMailer)
  lines = development_working_path.readlines
  unless lines.find { |line| line.include?("config.action_mailer.default_url_options") }
    index = lines.index { |line| line =~ /^Rails.application.configure do/ }
    lines.insert index + 1, "  config.action_mailer.default_url_options = {host: \"localhost\", port: 3000}\n\n"
    development_working_path.write lines.join

    say "✅ Action Mailer default_url_options defined"
  else
    say "⏩ Action Mailer default_url_options already defined. Skipping."
  end
end

# add default_url_options to development.rb for Action Controller
lines = development_working_path.readlines
unless lines.find { |line| line.include?("config.action_controller.default_url_options") }
  index = lines.index { |line| line =~ /^Rails.application.configure do/ }
  lines.insert index + 1, "  config.action_controller.default_url_options = {host: \"localhost\", port: 3000}\n"
  development_working_path.write lines.join

  say "✅ Action Controller default_url_options defined"
else
  say "⏩ Action Controller default_url_options already defined. Skipping."
end

complete_step :development
