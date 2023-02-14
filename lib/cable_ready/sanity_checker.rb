# frozen_string_literal: true

class CableReady::SanityChecker
  LATEST_VERSION_FORMAT = /^(\d+\.\d+\.\d+)$/

  class << self
    def check!
      return if ENV["SKIP_SANITY_CHECK"]
      return if CableReady.config.on_failed_sanity_checks == :ignore
      return if called_by_generate_config?
      return if called_by_rake?

      new
    end

    private

    def called_by_generate_config?
      ARGV.include?("cable_ready:initializer")
    end

    def called_by_rake?
      File.basename($PROGRAM_NAME) == "rake"
    end
  end

  private

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
