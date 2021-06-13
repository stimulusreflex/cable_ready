# frozen_string_literal: true

class CableReady::SanityChecker
  LATEST_VERSION_FORMAT = /^(\d+\.\d+\.\d+)$/
  NODE_VERSION_FORMAT = /(\d+\.\d+\.\d+.*):/
  JSON_VERSION_FORMAT = /(\d+\.\d+\.\d+.*)"/

  class << self
    def check!
      return if CableReady.config.on_failed_sanity_checks == :ignore
      return if called_by_generate_config?
      return if called_by_rake?

      instance = new
      instance.check_package_versions_match
      instance.check_new_version_available
    end

    private

    def called_by_generate_config?
      ARGV.include?("cable_ready:initializer")
    end

    def called_by_rake?
      caller.find { |c| c.include?("/gems/rake-") }
    end
  end

  def check_package_versions_match
    if npm_version.nil?
      warn_and_exit <<~WARN
        Can't locate the cable_ready npm package.
        Either add it to your package.json as a dependency or use "yarn link cable_ready" if you are doing development.
      WARN
    end

    if package_version_mismatch?
      warn_and_exit <<~WARN
        The cable_ready npm package version (#{npm_version}) does not match the Rubygem version (#{gem_version}).
        To update the cable_ready npm package:
          yarn upgrade cable_ready@#{gem_version}
      WARN
    end
  end

  def check_new_version_available
    return if CableReady.config.on_new_version_available == :ignore
    return if Rails.env.development? == false
    return if using_preview_release?
    begin
      latest_version = URI.open("https://raw.githubusercontent.com/stimulusreflex/cable_ready/master/LATEST", open_timeout: 1, read_timeout: 1).read.strip
      if latest_version != CableReady::VERSION
        puts <<~WARN

          There is a new version of CableReady available!
          Current: #{CableReady::VERSION} Latest: #{latest_version}

          If you upgrade, it is very important that you update BOTH Gemfile and package.json
          Then, run `bundle install && yarn install` to update to #{latest_version}.

        WARN
        exit if CableReady.config.on_new_version_available == :exit
      end
    rescue
      puts "CableReady #{CableReady::VERSION} update check skipped: connection timeout"
    end
  end

  private

  def package_version_mismatch?
    npm_version != gem_version
  end

  def using_preview_release?
    preview = CableReady::VERSION.match?(LATEST_VERSION_FORMAT) == false
    puts "CableReady #{CableReady::VERSION} update check skipped: pre-release build" if preview
    preview
  end

  def gem_version
    @_gem_version ||= CableReady::VERSION.gsub(".pre", "-pre")
  end

  def npm_version
    @_npm_version ||= find_npm_version
  end

  def find_npm_version
    if (match = search_file(package_json_path, regex: /version/))
      match[JSON_VERSION_FORMAT, 1]
    elsif (match = search_file(yarn_lock_path, regex: /^cable_ready/))
      match[NODE_VERSION_FORMAT, 1]
    end
  end

  def search_file(path, regex:)
    return if File.exist?(path) == false
    File.foreach(path).grep(regex).first
  end

  def package_json_path
    Rails.root.join("node_modules", "cable_ready", "package.json")
  end

  def yarn_lock_path
    Rails.root.join("yarn.lock")
  end

  def initializer_missing?
    File.exist?(Rails.root.join("config", "initializers", "cable_ready.rb")) == false
  end

  def warn_and_exit(text)
    puts 
    puts "Heads up! 🔥"
    puts
    puts text
    puts
    if CableReady.config.on_failed_sanity_checks == :exit
      puts <<~INFO
        If you know what you are doing and you want to start the application anyway, you can add the following directive to the CableReady initializer:

        CableReady.configure do |config|
            config.on_failed_sanity_checks = :warn
          end

      INFO
      if initializer_missing?
        puts <<~INFO
          You can create a CableReady initializer with the command:

            bundle exec rails generate cable_ready:initializer

        INFO
      end
      exit false if Rails.env.test? == false
    end
  end
end
