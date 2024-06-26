# frozen_string_literal: true

require "cable_ready/installer"

# verify that Action Cable is installed
if defined?(ActionCable::Engine)
  say "✅ ActionCable::Engine is loaded and in scope"
else
  CableReady::Installer.halt "ActionCable::Engine is not loaded, please add or uncomment `require \"action_cable/engine\"` to your `config/application.rb`"
  return
end

return if CableReady::Installer.pack_path_missing?

# verify that the Action Cable pubsub config is created
cable_config = Rails.root.join("config/cable.yml")

if cable_config.exist?
  say "✅ config/cable.yml is present"
else
  inside "config" do
    template "cable.yml"
  end
end

# verify that the Action Cable pubsub is set to use redis in development
yaml = YAML.safe_load(cable_config.read)
app_name = Rails.application.class.module_parent.name.underscore

if yaml["development"]["adapter"] == "redis"
  say "✅ config/cable.yml is configured to use the redis adapter in development"
elsif yaml["development"]["adapter"] == "async"
  yaml["development"] = {
    "adapter" => "redis",
    "url" => "<%= ENV.fetch(\"REDIS_URL\") { \"redis://localhost:6379/1\" } %>",
    "channel_prefix" => "#{app_name}_development"
  }
  CableReady::Installer.backup(cable_config) do
    cable_config.write(yaml.to_yaml)
  end
  say "✅ config/cable.yml was updated to use the redis adapter in development"
else
  say "🤷 config/cable.yml should use the redis adapter - or something like it - in development. You have something else specified, and we trust that you know what you're doing."
end

if Rails::VERSION::MAJOR >= 7
  CableReady::Installer.add_gem "redis@~> 5"
else
  CableReady::Installer.add_gem "redis@~> 4"
end

# install action-cable-redis-backport gem if using Action Cable < 7.1
unless ActionCable::VERSION::MAJOR >= 7 && ActionCable::VERSION::MINOR >= 1
  if !CableReady::Installer.gemfile.match?(/gem ['"]action-cable-redis-backport['"]/)
    CableReady::Installer.add_gem "action-cable-redis-backport@~> 1"
  end
end

# verify that the Action Cable channels folder and consumer class is available
step_path = "/app/javascript/channels/"
channels_path = Rails.root.join(CableReady::Installer.entrypoint, "channels")
consumer_src = CableReady::Installer.fetch(step_path, "consumer.js.tt")
consumer_path = channels_path / "consumer.js"
index_src = CableReady::Installer.fetch(step_path, "index.js.#{CableReady::Installer.bundler}.tt")
index_path = channels_path / "index.js"
friendly_index_path = index_path.relative_path_from(Rails.root).to_s

empty_directory channels_path unless channels_path.exist?

copy_file(consumer_src, consumer_path) unless consumer_path.exist?

if index_path.exist?
  if index_path.read == index_src.read
    say "✅ #{friendly_index_path} is present"
  else
    CableReady::Installer.backup(index_path) do
      copy_file(index_src, index_path, verbose: false)
    end
    say "✅ #{friendly_index_path} has been created"
  end
else
  copy_file(index_src, index_path)
end

# import Action Cable channels into application pack
channels_pattern = /import ['"](\.\.\/|\.\/)?channels['"]/
channels_commented_pattern = /\s*\/\/\s*#{channels_pattern}/
channel_import = "import \"#{CableReady::Installer.prefix}channels\"\n"

if CableReady::Installer.pack.match?(channels_pattern)
  if CableReady::Installer.pack.match?(channels_commented_pattern)
    proceed = if CableReady::Installer.options.key? "uncomment"
      CableReady::Installer.options["uncomment"]
    else
      !no?("✨ Action Cable seems to be commented out in your application.js. Do you want to uncomment it? (Y/n)")
    end

    if proceed
      # uncomment_lines only works with Ruby comments 🙄
      lines = CableReady::Installer.pack_path.readlines
      matches = lines.select { |line| line =~ channels_commented_pattern }
      lines[lines.index(matches.last).to_i] = channel_import
      CableReady::Installer.pack_path.write lines.join
      say "✅ channels imported in #{CableReady::Installer.friendly_pack_path}"
    else
      say "🤷 your Action Cable channels are not being imported in your application.js. We trust that you have a reason for this."
    end
  else
    say "✅ channels imported in #{CableReady::Installer.friendly_pack_path}"
  end
else
  lines = CableReady::Installer.pack_path.readlines
  matches = lines.select { |line| line =~ /^import / }
  lines.insert lines.index(matches.last).to_i + 1, channel_import
  CableReady::Installer.pack_path.write lines.join
  say "✅ channels imported in #{CableReady::Installer.friendly_pack_path}"
end

# create working copy of Action Cable initializer in tmp
if CableReady::Installer.action_cable_initializer_path.exist?
  FileUtils.cp(CableReady::Installer.action_cable_initializer_path, CableReady::Installer.action_cable_initializer_working_path)
else
  # create Action Cable initializer if it doesn't already exist
  create_file(CableReady::Installer.action_cable_initializer_working_path, verbose: false) do
    <<~RUBY
      # frozen_string_literal: true

    RUBY
  end
  say "✅ Action Cable initializer created"
end

# silence notoriously chatty Action Cable logs
if !CableReady::Installer.action_cable_initializer_working_path.read.match?(/^[^#]*ActionCable.server.config.logger/)
  append_file(CableReady::Installer.action_cable_initializer_working_path, verbose: false) do
    <<~RUBY
      ActionCable.server.config.logger = Logger.new(nil)

    RUBY
  end
  say "✅ Action Cable logger silenced for performance and legibility"
end

CableReady::Installer.complete_step :action_cable
