# frozen_string_literal: true

require "test_helper"

def revert_config_changes(key)
  previous_value = CableReady.config.send(key)

  yield

  CableReady.config.send("#{key}=", previous_value)
end

class CableReady::ConfigTest < ActionView::TestCase
  test "sets on_failed_sanity_checks" do
    revert_config_changes(:on_failed_sanity_checks) do
      assert_equal :ignore, CableReady.config.on_failed_sanity_checks

      CableReady.configure do |config|
        config.on_failed_sanity_checks = :warn
      end

      assert_equal :warn, CableReady.config.on_failed_sanity_checks
    end
  end

  test "sets broadcast_job_queue" do
    revert_config_changes(:broadcast_job_queue) do
      assert_equal :default, CableReady.config.broadcast_job_queue

      CableReady.configure do |config|
        config.broadcast_job_queue = :something_else
      end

      assert_equal :something_else, CableReady.config.broadcast_job_queue
    end
  end

  test "sets precompile_assets" do
    revert_config_changes(:precompile_assets) do
      assert CableReady.config.precompile_assets

      CableReady.configure do |config|
        config.precompile_assets = false
      end

      refute CableReady.config.precompile_assets
    end
  end

  test "adds add_operation_name" do
    refute_includes CableReady.config.operation_names, :jazz_hands

    CableReady.configure do |config|
      config.add_operation_name :jazz_hands
    end

    assert_includes CableReady.config.operation_names, :jazz_hands
  end

  test "shows on_new_version_available notice" do
    revert_config_changes(:on_new_version_available) do
      assert_output(nil, %(NOTICE: The `config.on_new_version_available` option has been removed from the CableReady initializer. You can safely remove this option from your initializer.\n)) do
        CableReady.configure do |config|
          config.on_new_version_available = :ignore
        end
      end

      assert_output(nil, %(NOTICE: The `config.on_new_version_available` option has been removed from the CableReady initializer. You can safely remove this option from your initializer.\n)) do
        CableReady.config.on_new_version_available
      end
    end
  end

  test "sets updatable debounce time" do
    revert_config_changes(:updatable_debounce_time) do
      assert_equal 0.seconds, CableReady.config.updatable_debounce_time

      CableReady.configure do |config|
        config.updatable_debounce_time = 1.seconds
      end

      assert_equal 1.seconds, CableReady.config.updatable_debounce_time
    end
  end
end
