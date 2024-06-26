# frozen_string_literal: true

require "cable_ready/installer"

spring_pattern = /^[^#]*gem ["']spring["']/

proceed = false
lines = CableReady::Installer.gemfile_path.readlines

if lines.index { |line| line =~ spring_pattern }
  proceed = if CableReady::Installer.options.key? "spring"
    CableReady::Installer.options["spring"]
  else
    !no?("✨ Would you like to disable the spring gem? \nIt's been removed from Rails 7, and is the frequent culprit behind countless mystery bugs. (Y/n)")
  end
else
  say "⏩ Spring is not installed."
end

if proceed
  spring_watcher_pattern = /^[^#]*gem ["']spring-watcher-listen["']/
  bin_rails_pattern = /^[^#]*load File.expand_path\("spring", __dir__\)/

  if (index = lines.index { |line| line =~ spring_pattern })
    CableReady::Installer.remove_gem :spring

    bin_spring = Rails.root.join("bin/spring")
    if bin_spring.exist?
      run "bin/spring binstub --remove --all"
      say "✅ Removed spring binstubs"
    end

    bin_rails = Rails.root.join("bin/rails")
    bin_rails_content = bin_rails.readlines
    if (index = bin_rails_content.index { |line| line =~ bin_rails_pattern })
      CableReady::Installer.backup(bin_rails) do
        bin_rails_content[index] = "# #{bin_rails_content[index]}"
        bin_rails.write bin_rails_content.join
      end
      say "✅ Removed spring from bin/rails"
    end
    create_file "tmp/cable_ready_installer/kill_spring", verbose: false
  else
    say "✅ spring has been successfully removed"
  end

  if lines.index { |line| line =~ spring_watcher_pattern }
    CableReady::Installer.remove_gem "spring-watcher-listen"
  end
else
  say "⏩ Skipping."
end

CableReady::Installer.complete_step :spring
