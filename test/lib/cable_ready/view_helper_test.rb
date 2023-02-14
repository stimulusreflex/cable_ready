# frozen_string_literal: true

require "test_helper"

class CableReady::ViewHelperTest < ActionView::TestCase
  # stream_from

  test "renders <cable-ready-stream-from> element" do
    expected = %(<cable-ready-stream-from identifier="ImtleSI=--e3efcba75b971eb15fa7fcc579a16c2b7a3734081bf7dbbace7240ebfbda078d"></cable-ready-stream-from>)

    assert_dom_equal expected, cable_ready_stream_from("key")
  end

  test "stream_from renders html options" do
    fragment = Nokogiri::HTML.fragment(cable_ready_stream_from("key", html_options: {class: "block", data: {controller: "modal"}}) {})
    element = fragment.children.first

    assert_equal "cable-ready-stream-from", element.name
    assert_equal "block", element["class"]
    assert_equal "modal", element["data-controller"]
  end

  # updates_for

  test "renders <cable-ready-updates-for> element" do
    expected = %(<cable-ready-updates-for identifier="ImtleSI=--e3efcba75b971eb15fa7fcc579a16c2b7a3734081bf7dbbace7240ebfbda078d"></cable-ready-updates-for>)

    assert_dom_equal expected, cable_ready_updates_for("key") {}
  end

  test "updates_for renders html options" do
    fragment = Nokogiri::HTML.fragment(cable_ready_updates_for("key", html_options: {class: "block", data: {controller: "modal"}}) {})
    element = fragment.children.first

    assert_equal "cable-ready-updates-for", element.name
    assert_equal "block", element["class"]
    assert_equal "modal", element["data-controller"]
  end

  # conditional updates_for

  test "updates_for_if renders if condition is met" do
    fragment = Nokogiri::HTML.fragment(cable_ready_updates_for_if(true, "key") { tag.div })
    element = fragment.children.first

    assert_equal "cable-ready-updates-for", element.name
    refute_equal "div", element.name
  end

  test "updates_for_if doesn't render if condition isn't met" do
    fragment = Nokogiri::HTML.fragment(cable_ready_updates_for_if(false, "key") { tag.div })
    element = fragment.children.first

    refute_equal "cable-ready-updates-for", element.name
    assert_equal "div", element.name
  end

  test "raises when including CableReadyHelper" do
    expection = assert_raises do
      class RaiseHelperTest # standard:disable Lint/ConstantDefinitionInBlock
        include ::CableReadyHelper
      end

      RaiseHelperTest.new
    end

    assert_equal "`CableReadyHelper` was renamed to `CableReady::ViewHelper`", expection.message
  end

  # deprecation warnings

  test "updates_for deprecation warning" do
    assert_output(nil, /DEPRECATED: please use `cable_ready_updates_for` instead. The `updates_for` view helper will be removed from a future version of CableReady 5/) do
      expected = %(<cable-ready-updates-for identifier="ImtleSI=--e3efcba75b971eb15fa7fcc579a16c2b7a3734081bf7dbbace7240ebfbda078d"></cable-ready-stream-from>)

      assert_dom_equal expected, updates_for("key") {}
    end
  end

  test "updates_for_if deprecation warning" do
    assert_output(nil, /DEPRECATED: please use `cable_ready_updates_for_if` instead. The `updates_for_if` view helper will be removed from a future version of CableReady 5/) do
      expected = %(<cable-ready-updates-for identifier="ImtleSI=--e3efcba75b971eb15fa7fcc579a16c2b7a3734081bf7dbbace7240ebfbda078d"></cable-ready-stream-from>)

      assert_dom_equal expected, updates_for_if(true, "key") {}
    end
  end

  test "stream_from deprecation warning" do
    assert_output(nil, /DEPRECATED: please use `cable_ready_stream_from` instead. The `stream_from` view helper will be removed from a future version of CableReady 5/) do
      expected = %(<cable-ready-stream-from identifier="ImtleSI=--e3efcba75b971eb15fa7fcc579a16c2b7a3734081bf7dbbace7240ebfbda078d"></cable-ready-stream-from>)

      assert_dom_equal expected, stream_from("key")
    end
  end

  # ensure dom_id emits no #s

  test "emits the correct dom_id" do
    assert_equal "new_post", dom_id(Post.new)
  end
end
