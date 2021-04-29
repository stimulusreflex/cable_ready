# frozen_string_literal: true

class CableReady::SanityChecker
  LATEST_VERSION_FORMAT = /^(\d+\.\d+\.\d+)$/
  NODE_VERSION_FORMAT = /(\d+\.\d+\.\d+.*):/
  JSON_VERSION_FORMAT = /(\d+\.\d+\.\d+.*)"/

  class << self
    def check!
      return if CableReady.config.on_failed_sanity_checks == :ignore
      return if called_by_generate_config?

      instance = new
      instance.check_javascript_package_version
      instance.check_new_version_available
    end

    private

    def called_by_generate_config?
      ARGV.include? "cable_ready:initializer"
    end
  end

  def check_javascript_package_version
    if javascript_package_version.nil?
      warn_and_exit <<~WARN
        Can't locate the cable_ready npm package.
        Either add it to your package.json as a dependency or use "yarn link cable_ready" if you are doing development.
      WARN
    end

    unless javascript_version_matches?
      warn_and_exit <<~WARN
        The cable_ready npm package version (#{javascript_package_version}) does not match the Rubygem version (#{gem_version}).
        To update the cable_ready npm package:
          yarn upgrade cable_ready@#{gem_version}
      WARN
    end
  end

  def check_new_version_available
    return unless Rails.env.development?
    return if CableReady.config.on_new_version_available == :ignore
    return unless using_stable_release
    begin
      latest_version = URI.open("https://raw.githubusercontent.com/hopsoft/cable_ready/master/LATEST", open_timeout: 1, read_timeout: 1).read.strip
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

  def javascript_version_matches?
    javascript_package_version == gem_version
  end

  def using_stable_release
    stable = CableReady::VERSION.match?(LATEST_VERSION_FORMAT)
    puts "CableReady #{CableReady::VERSION} update check skipped: pre-release build" unless stable
    stable
  end

  def gem_version
    @_gem_version ||= CableReady::VERSION.gsub(".pre", "-pre")
  end

  def javascript_package_version
    @_js_version ||= find_javascript_package_version
  end

  def find_javascript_package_version
    if (match = search_file(package_json_path, regex: /version/))
      match[JSON_VERSION_FORMAT, 1]
    elsif (match = search_file(yarn_lock_path, regex: /^cable_ready/))
      match[NODE_VERSION_FORMAT, 1]
    end
  end

  def search_file(path, regex:)
    return unless File.exist?(path)
    File.foreach(path).grep(regex).first
  end

  def package_json_path
    Rails.root.join("node_modules", "cable_ready", "package.json")
  end

  def yarn_lock_path
    Rails.root.join("yarn.lock")
  end

  def initializer_path
    @_initializer_path ||= Rails.root.join("config", "initializers", "cable_ready.rb")
  end

  def warn_and_exit(text)
    puts "WARNING:"
    puts text
    exit_with_info if CableReady.config.on_failed_sanity_checks == :exit
  end

  def exit_with_info
    puts

    if File.exist?(initializer_path)
      puts <<~INFO
        If you know what you are doing and you want to start the application anyway,
        you can add the following directive to the CableReady initializer,
        which is located at #{initializer_path}

          CableReady.configure do |config|
            config.on_failed_sanity_checks = :warn
          end

      INFO
    else
      puts <<~INFO
        If you know what you are doing and you want to start the application anyway,
        you can create a CableReady initializer with the command:

        bundle exec rails generate cable_ready:config

        Then open your initializer at

        #{initializer_path}

        and then add the following directive:

          CableReady.configure do |config|
            config.on_failed_sanity_checks = :warn
          end

      INFO
    end
    exit false unless Rails.env.test?
  end
end
