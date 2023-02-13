# frozen_string_literal: true

require "cable_ready/installer"

lines = package_json.readlines

if !lines.index { |line| line =~ /^\s*["']cable_ready["']: ["'].*#{cr_npm_version}["']/ }
  add_package "cable_ready@#{cr_npm_version}"
else
  say "⏩ cable_ready npm package is already present"
end

complete_step :npm_packages
