# frozen_string_literal: true

class CableReady::SanityChecker
  LATEST_VERSION_FORMAT = /^(\d+\.\d+\.\d+)$/

  class << self
    def check!
      return if ENV["SKIP_SANITY_CHECK"]
      return if CableReady.config.on_failed_sanity_checks == :ignore
      return if called_by_generate_config?
      return if called_by_rake?

      instance = new
      instance.check_new_version_available
    end

    private

    def called_by_generate_config?
      ARGV.include?("cable_ready:initializer")
    end

    def called_by_rake?
      File.basename($PROGRAM_NAME) == "rake"
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

          👉 There is a new version of CableReady available!
          Current: #{CableReady::VERSION} Latest: #{latest_version}

          If you upgrade, it is very important that you update BOTH Gemfile and package.json
          Then, run `bundle install && yarn install` to update to #{latest_version}.

        WARN
        exit if CableReady.config.on_new_version_available == :exit
      end
    rescue
      puts "👉 CableReady #{CableReady::VERSION} update check skipped: connection timeout"
    end
  end

  private

  def using_preview_release?
    preview = CableReady::VERSION.match?(LATEST_VERSION_FORMAT) == false
    puts "👉 CableReady #{CableReady::VERSION} update check skipped: pre-release build" if preview
    preview
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
        To ignore any warnings and start the application anyway, you can set the SKIP_SANITY_CHECK environment variable:

          SKIP_SANITY_CHECK=true rails

        To do this permanently, add the following directive to the CableReady initializer:

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
