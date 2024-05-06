# frozen_string_literal: true

require "cable_ready/installer"

if CableReady::Installer.application_record_path.exist?
  lines = CableReady::Installer.application_record_path.readlines

  if !lines.index { |line| line =~ /^\s*include CableReady::Updatable/ }
    proceed = if CableReady::Installer.options.key? "updatable"
      CableReady::Installer.options["updatable"]
    else
      !no?("✨ Include CableReady::Updatable in Active Record model classes? (Y/n)")
    end

    unless proceed
      CableReady::Installer.complete_step :updatable

      puts "⏩ Skipping."
      return
    end

    index = lines.index { |line| line.include?("class ApplicationRecord < ActiveRecord::Base") }
    lines.insert index + 1, "  include CableReady::Updatable\n"
    CableReady::Installer.application_record_path.write lines.join

    say "✅ included CableReady::Updatable in ApplicationRecord"
  else
    say "⏩ CableReady::Updatable has already been included in Active Record model classes. Skipping."
  end
else
  say "⏩ ApplicationRecord doesn't exist. Skipping."
end

CableReady::Installer.complete_step :updatable
