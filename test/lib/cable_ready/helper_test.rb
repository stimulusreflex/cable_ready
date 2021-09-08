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

  # broadcast_from

  test "broadcast_from renders html options" do
    element = Nokogiri::HTML.fragment(broadcast_from("key", html_options: {class: "block", data: {controller: "modal"}}) {})

    assert_equal "block", element.children.first["class"]
    assert_equal "modal", element.children.first["data-controller"]
  end
end
