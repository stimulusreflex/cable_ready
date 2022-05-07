# frozen_string_literal: true

require "test_helper"

class CableReady::HelperTest < ActionView::TestCase
  include CableReadyHelper

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
end
