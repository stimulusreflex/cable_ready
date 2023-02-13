# frozen_string_literal: true

require "cable_ready/version"

### general utilities

def fetch(step_path, file)
  relative_path = step_path + file
  location = template_src + relative_path

  Pathname.new(location)
end

def complete_step(step)
  create_file "tmp/cable_ready_installer/#{step}", verbose: false
end

def create_or_append(path, *args, &block)
  FileUtils.touch(path)
  append_file(path, *args, &block)
end

def current_template
  ENV["LOCATION"].split("/").last.gsub(".rb", "")
end

def pack_path_missing?
  return false unless pack_path.nil?
  halt "#{friendly_pack_path} is missing. You need a valid application pack file to proceed."
end

def halt(message)
  say "❌ #{message}", :red
  create_file "tmp/cable_ready_installer/halt", verbose: false
end

def backup(path, delete: false)
  if !path.exist?
    yield
    return
  end

  backup_path = Pathname.new("#{path}.bak")
  old_path = path.relative_path_from(Rails.root).to_s
  filename = path.to_path.split("/").last

  if backup_path.exist?
    if backup_path.read == path.read
      path.delete if delete
      yield
      return
    end
    backup_path.delete
  end

  copy_file(path, backup_path, verbose: false)
  path.delete if delete

  yield

  if path.read != backup_path.read
    create_or_append(backups_path, "#{old_path}\n", verbose: false)
  end
  say "📦 #{old_path} backed up as #{filename}.bak"
end

def add_gem(name)
  create_or_append(add_gem_list, "#{name}\n", verbose: false)
  say "☑️  Added #{name} to the Gemfile"
end

def remove_gem(name)
  create_or_append(remove_gem_list, "#{name}\n", verbose: false)
  say "❎ Removed #{name} from Gemfile"
end

def add_package(name)
  create_or_append(package_list, "#{name}\n", verbose: false)
  say "☑️  Enqueued #{name} to be added to dependencies"
end

def add_dev_package(name)
  create_or_append(dev_package_list, "#{name}\n", verbose: false)
  say "☑️  Enqueued #{name} to be added to dev dependencies"
end

def drop_package(name)
  create_or_append(drop_package_list, "#{name}\n", verbose: false)
  say "❎ Enqueued #{name} to be removed from dependencies"
end

def gemfile_hash
  Digest::MD5.hexdigest(gemfile_path.read)
end

### memoized values

def cr_npm_version
  @cr_npm_version ||= CableReady::VERSION.gsub(".pre", "-pre")
end

def package_json
  @package_json ||= Rails.root.join("package.json")
end

def entrypoint
  @entrypoint ||= File.read("tmp/cable_ready_installer/entrypoint")
end

def bundler
  @bundler ||= File.read("tmp/cable_ready_installer/bundler")
end

def config_path
  @config_path ||= Rails.root.join(entrypoint, "config")
end

def importmap_path
  @importmap_path ||= Rails.root.join("config/importmap.rb")
end

def friendly_importmap_path
  @friendly_importmap_path ||= importmap_path.relative_path_from(Rails.root).to_s
end

def pack
  @pack ||= pack_path.read
end

def friendly_pack_path
  @friendly_pack_path ||= pack_path.relative_path_from(Rails.root).to_s
end

def pack_path
  @pack_path ||= [
    Rails.root.join(entrypoint, "application.js"),
    Rails.root.join(entrypoint, "packs/application.js"),
    Rails.root.join(entrypoint, "entrypoints/application.js")
  ].find(&:exist?)
end

def package_list
  @package_list ||= Rails.root.join("tmp/cable_ready_installer/npm_package_list")
end

def dev_package_list
  @dev_package_list ||= Rails.root.join("tmp/cable_ready_installer/npm_dev_package_list")
end

def drop_package_list
  @drop_package_list ||= Rails.root.join("tmp/cable_ready_installer/drop_npm_package_list")
end

def template_src
  @template_src ||= File.read("tmp/cable_ready_installer/template_src")
end

def controllers_path
  @controllers_path ||= Rails.root.join(entrypoint, "controllers")
end

def gemfile_path
  @gemfile_path ||= Rails.root.join("Gemfile")
end

def gemfile
  @gemfile ||= gemfile_path.read
end

def prefix
  # standard:disable Style/RedundantStringEscape
  @prefix ||= {
    "vite" => "..\/",
    "webpacker" => "",
    "shakapacker" => "",
    "importmap" => "",
    "esbuild" => ".\/"
  }[bundler]
  # standard:enable Style/RedundantStringEscape
end

def application_record_path
  @application_record_path ||= Rails.root.join("app/models/application_record.rb")
end

def action_cable_initializer_path
  @action_cable_initializer_path ||= Rails.root.join("config/initializers/action_cable.rb")
end

def action_cable_initializer_working_path
  @action_cable_initializer_working_path ||= Rails.root.join(working, "action_cable.rb")
end

def development_path
  @development_path ||= Rails.root.join("config/environments/development.rb")
end

def development_working_path
  @development_working_path ||= Rails.root.join(working, "development.rb")
end

def backups_path
  @backups_path ||= Rails.root.join("tmp/cable_ready_installer/backups")
end

def add_gem_list
  @add_gem_list ||= Rails.root.join("tmp/cable_ready_installer/add_gem_list")
end

def remove_gem_list
  @remove_gem_list ||= Rails.root.join("tmp/cable_ready_installer/remove_gem_list")
end

def options_path
  @options_path ||= Rails.root.join("tmp/cable_ready_installer/options")
end

def options
  @options ||= YAML.safe_load(File.read(options_path))
end

def working
  @working ||= Rails.root.join("tmp/cable_ready_installer/working")
end
