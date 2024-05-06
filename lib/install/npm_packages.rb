# frozen_string_literal: true

require "cable_ready/installer"

lines = CableReady::Installer.package_json.readlines

if !lines.index { |line| line =~ /^\s*["']cable_ready["']: ["'].*#{CableReady::Installer.cr_npm_version}["']/ }
  CableReady::Installer.add_package "cable_ready@#{CableReady::Installer.cr_npm_version}"
else
  say "⏩ cable_ready npm package is already present"
end

CableReady::Installer.complete_step :npm_packages
