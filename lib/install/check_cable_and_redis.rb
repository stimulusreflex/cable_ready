say "Checking ActionCable and Redis"

say "ActionCable configuration (config/cable.yml) is missing. CableReady depends on ActionCable, please provide a config file.", :red unless Rails.root.join("config/cable.yml").exist?

gemfile_content = File.read(Rails.root.join("Gemfile"))
redis_pattern = /gem ['"]redis['"]/

if gemfile_content.match?(redis_pattern)
  if gemfile_content.match?(/\s*#\s*#{redis_pattern}/) && yes?("Redis seems to be commented out in your Gemfile. Do you want CableReady to uncomment it?")
    uncomment_lines "Gemfile", redis_pattern
  end
elsif yes?("Redis doesn't seem to be installed in your Rails app. Would you like CableReady to install it?")
  append_file "Gemfile", "\n# Use Redis for Action Cable"
  gem "redis", "~> 4.0"
end

run_bundle
