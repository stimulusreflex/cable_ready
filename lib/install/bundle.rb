# frozen_string_literal: true

require "cable_ready/installer"

hash = CableReady::Installer.gemfile_hash

# run bundle only when gems are waiting to be added or removed
add = CableReady::Installer.add_gem_list.exist? ? CableReady::Installer.add_gem_list.readlines.map(&:chomp) : []
remove = CableReady::Installer.remove_gem_list.exist? ? CableReady::Installer.remove_gem_list.readlines.map(&:chomp) : []

if add.present? || remove.present?
  lines = CableReady::Installer.gemfile_path.readlines

  remove.each do |name|
    index = lines.index { |line| line =~ /gem ['"]#{name}['"]/ }
    if index
      if /^[^#]*gem ['"]#{name}['"]/.match?(lines[index])
        lines[index] = "# #{lines[index]}"
        say "✅ #{name} gem has been disabled"
      else
        say "⏩ #{name} gem is already disabled. Skipping."
      end
    end
  end

  add.each do |package|
    matches = package.match(/(.+)@(.+)/)
    name, version = matches[1], matches[2]

    index = lines.index { |line| line =~ /gem ['"]#{name}['"]/ }
    if index
      if !lines[index].match(/^[^#]*gem ['"]#{name}['"].*#{version}['"]/)
        lines[index] = "\ngem \"#{name}\", \"#{version}\"\n"
        say "✅ #{name} gem has been installed"
      else
        say "⏩ #{name} gem is already installed. Skipping."
      end
    else
      lines << "\ngem \"#{name}\", \"#{version}\"\n"
    end
  end

  CableReady::Installer.gemfile_path.write lines.join

  bundle_command("install --quiet", "BUNDLE_IGNORE_MESSAGES" => "1") if hash != CableReady::Installer.gemfile_hash
end

FileUtils.cp(CableReady::Installer.development_working_path, CableReady::Installer.development_path)
say "✅ development environment configuration installed"

FileUtils.cp(CableReady::Installer.action_cable_initializer_working_path, CableReady::Installer.action_cable_initializer_path)
say "✅ Action Cable initializer installed"

CableReady::Installer.complete_step :bundle
