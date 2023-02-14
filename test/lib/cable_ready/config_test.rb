# frozen_string_literal: true

require "test_helper"

class CableReady::ConfigTest < ActionView::TestCase
  test "sets on_failed_sanity_checks" do
    assert_equal :ignore, CableReady.config.on_failed_sanity_checks

    CableReady.configure do |config|
      config.on_failed_sanity_checks = :warn
    end

    assert_equal :warn, CableReady.config.on_failed_sanity_checks
  end

  test "sets broadcast_job_queue" do
    assert_equal :default, CableReady.config.broadcast_job_queue

    CableReady.configure do |config|
      config.broadcast_job_queue = :something_else
    end

    assert_equal :something_else, CableReady.config.broadcast_job_queue
  end

  test "sets precompile_assets" do
    assert CableReady.config.precompile_assets

    CableReady.configure do |config|
      config.precompile_assets = false
    end

    refute CableReady.config.precompile_assets
  end

  test "adds add_operation_name" do
    refute_includes CableReady.config.operation_names, :jazz_hands

    CableReady.configure do |config|
      config.add_operation_name :jazz_hands
    end

    assert_includes CableReady.config.operation_names, :jazz_hands
  end

  test "sets on_new_version_available" do
    assert_equal :ignore, CableReady.config.on_new_version_available

    CableReady.configure do |config|
      config.on_new_version_available = :warn
    end

    assert_equal :warn, CableReady.config.on_new_version_available
  end
end
