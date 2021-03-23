# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

class CableReady::CableCarTest < ActiveSupport::TestCase
  setup do
    @cable_car = CableReady::CableCar.instance
  end

  test "ride should return json-ifiable payload" do
    CableReady::CableCar.instance.reset!
    ride = CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").ride
    assert_equal({"innerHtml" => [{"selector" => "#users", "html" => "<span>winning</span>"}]}, ride)
  end

  test "ride should clear operations" do
    CableReady::CableCar.instance.reset!
    CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").ride
    assert_equal({}, CableReady::CableCar.instance.instance_variable_get(:@enqueued_operations))
  end

  test "ride should maintain operations if clear is false" do
    CableReady::CableCar.instance.reset!
    CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").ride(clear: false)
    assert_equal({"inner_html" => [{"selector" => "#users", "html" => "<span>winning</span>"}]}, CableReady::CableCar.instance.instance_variable_get(:@enqueued_operations))
  end
end
