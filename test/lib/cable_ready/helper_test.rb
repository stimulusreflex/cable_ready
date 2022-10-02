# frozen_string_literal: true

require "test_helper"

class CableReady::HelperTest < ActionView::TestCase
  include CableReady::Helper

  # stream_from

  test "stream_from renders html options" do
    element = Nokogiri::HTML.fragment(stream_from("key", html_options: {class: "block", data: {controller: "modal"}}) {})

    assert_equal "block", element.children.first["class"]
    assert_equal "modal", element.children.first["data-controller"]
  end

  # updates_for

  test "updates_for renders html options" do
    element = Nokogiri::HTML.fragment(updates_for("key", html_options: {class: "block", data: {controller: "modal"}}) {})

    assert_equal "block", element.children.first["class"]
    assert_equal "modal", element.children.first["data-controller"]
  end

  # conditional updates_for

  test "updates_for_if renders if condition is met" do
    element = Nokogiri::HTML.fragment(updates_for_if(true, "key") { tag.div })

    assert_equal "updates-for", element.children.first.name
    refute_equal "div", element.children.first.name
  end

  test "updates_for_if doesn't render if condition isn't met" do
    element = Nokogiri::HTML.fragment(updates_for_if(false, "key") { tag.div })

    refute_equal "updates-for", element.children.first.name
    assert_equal "div", element.children.first.name
  end

  # cable_ready_tag

  test "cable_ready_tag will render out a custom element" do
    element = Nokogiri::HTML.fragment(
      cable_ready_tag(cable_car.console_log(message: "Testy McTestface"))
    )

    assert_equal "cable-ready", element.children.first.name
    script_tag = element.children.first.children.first
    assert_equal "script", script_tag.name
    assert_equal "application/json", script_tag[:type]
    assert_equal [{"operation" => "consoleLog", "message" => "Testy McTestface"}], JSON.parse(script_tag.content)
  end

  test "raises when including CableReadyHelper" do
    expection = assert_raises do
      class RaiseHelperTest # standard:disable Lint/ConstantDefinitionInBlock
        include ::CableReadyHelper
      end

      RaiseHelperTest.new
    end

    assert_equal "`CableReadyHelper` was renamed to `CableReady::Helper`", expection.message
  end
end
