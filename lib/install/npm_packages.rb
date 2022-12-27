require "cable_ready/installer"

lines = package_json.readlines

if !lines.index { |line| line =~ /^\s*["']cable_ready["']: ["'].*#{cr_npm_version}["']/ }
  add_package "cable_ready@#{cr_npm_version}"
end

complete_step :npm_packages
