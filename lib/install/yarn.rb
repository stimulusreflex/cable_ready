# frozen_string_literal: true

require "cable_ready/installer"

if !CableReady::Installer.package_json.exist?
  say "⏩ No package.json file found. Skipping."

  return
end

# run yarn install only when packages are waiting to be added or removed
add = CableReady::Installer.package_list.exist? ? CableReady::Installer.package_list.readlines.map(&:chomp) : []
dev = CableReady::Installer.dev_package_list.exist? ? CableReady::Installer.dev_package_list.readlines.map(&:chomp) : []
drop = CableReady::Installer.drop_package_list.exist? ? CableReady::Installer.drop_package_list.readlines.map(&:chomp) : []

json = JSON.parse(CableReady::Installer.package_json.read)

if add.present? || dev.present? || drop.present?

  add.each do |package|
    matches = package.match(/(.+)@(.+)/)
    name, version = matches[1], matches[2]
    json["dependencies"] = {} unless json["dependencies"]
    json["dependencies"][name] = version
  end

  dev.each do |package|
    matches = package.match(/(.+)@(.+)/)
    name, version = matches[1], matches[2]
    json["devDependencies"] = {} unless json["devDependencies"]
    json["devDependencies"][name] = version
  end

  drop.each do |package|
    json["dependencies"].delete(package)
    json["devDependencies"].delete(package)
  end

  CableReady::Installer.package_json.write JSON.pretty_generate(json)

  system "yarn install --silent"
else
  say "⏩ No yarn depdencies to add or remove. Skipping."

end

if CableReady::Installer.bundler == "esbuild" && json["scripts"]["build"] != "node esbuild.config.mjs"
  json["scripts"]["build:default"] = json["scripts"]["build"]
  json["scripts"]["build"] = "node esbuild.config.mjs"
  CableReady::Installer.package_json.write JSON.pretty_generate(json)
  say "✅ Your build script has been updated to use esbuild.config.mjs"
else
  say "⏩ Your build script is already setup. Skipping."
end

CableReady::Installer.complete_step :yarn
