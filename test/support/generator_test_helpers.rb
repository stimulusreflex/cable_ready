# frozen_string_literal: true

require "byebug"

module GeneratorTestHelpers
  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def sample_app_path
      File.expand_path("../../tmp/dummy", __dir__)
    end

    def prepare_destination
      FileUtils.rm_rf(sample_app_path) if Dir.exist?(sample_app_path)
      FileUtils.mkdir_p(sample_app_path)
    end

    def create_sample_app
      FileUtils.cd(sample_app_path) do
        system "rails new . --minimal --skip-active-record --skip-test-unit --skip-spring --skip-bundle --quiet --force"
      end
    end

    def remove_sample_app
      FileUtils.rm_rf(destination_root)
    end
  end
end
