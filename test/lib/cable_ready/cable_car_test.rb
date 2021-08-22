# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

class CableReady::CableCarTest < ActiveSupport::TestCase
  setup do
    @cable_car = CableReady::CableCar.instance
  end

  test "dispatch should return json-ifiable payload" do
    CableReady::CableCar.instance.reset!
    dispatch = CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").dispatch
    assert_equal([{"operation" => "innerHtml", "selector" => "#users", "html" => "<span>winning</span>"}], dispatch)
  end

  test "dispatch should clear operations" do
    CableReady::CableCar.instance.reset!
    CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").dispatch
    assert_equal([], CableReady::CableCar.instance.instance_variable_get(:@enqueued_operations))
  end

  test "dispatch should maintain operations if clear is false" do
    CableReady::CableCar.instance.reset!
    CableReady::CableCar.instance.inner_html(selector: "#users", html: "<span>winning</span>").dispatch(clear: false)
    assert_equal([{"operation" => "innerHtml", "selector" => "#users", "html" => "<span>winning</span>"}], CableReady::CableCar.instance.instance_variable_get(:@enqueued_operations))
  end

  test "selectors should accept any object which respond_to? to_dom_selector" do
    CableReady::CableCar.instance.reset!
    my_object = Struct.new(:id) do
      def to_dom_selector
        ".#{id}"
      end
    end.new("users")
    dispatch = CableReady::CableCar.instance.inner_html(selector: my_object, html: "<span>winning</span>").dispatch
    assert_equal([{"operation" => "innerHtml", "selector" => ".users", "html" => "<span>winning</span>"}], dispatch)
  end

  test "selectors should accept any object which respond_to? to_dom_id" do
    CableReady::CableCar.instance.reset!
    my_object = Struct.new(:id) do
      def to_dom_id
        id
      end
    end.new("users")
    dispatch = CableReady::CableCar.instance.inner_html(selector: my_object, html: "<span>winning</span>").dispatch
    assert_equal([{"operation" => "innerHtml", "selector" => "#users", "html" => "<span>winning</span>"}], dispatch)
  end
end
