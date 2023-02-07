# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

class Death
  def to_html
    "I rock"
  end

  def to_dom_id
    "death"
  end

  def to_operation_options
    [:html, :dom_id, :spaz]
  end
end

class Life
  def to_operation_options
    {
      html: "You go, girl",
      dom_id: "life"
    }
  end
end

class CableReady::OperationBuilderTest < ActiveSupport::TestCase
  setup do
    @operation_builder = CableReady::OperationBuilder.new("test")
  end

  test "should create enqueued operations" do
    assert_not_nil @operation_builder.instance_variable_get(:@enqueued_operations)
  end

  test "should add observer to cable ready" do
    assert_not_nil CableReady.config.instance_variable_get(:@observer_peers)[@operation_builder]
  end

  test "should remove observer when destroyed" do
    @operation_builder = nil
    assert_nil CableReady.config.instance_variable_get(:@observer_peers)[@operation_builder]
  end

  test "should add operation method" do
    @operation_builder.add_operation_method("foobar")
    assert @operation_builder.respond_to?(:foobar)
  end

  test "added operation method should add keys" do
    @operation_builder.add_operation_method("foobar")
    @operation_builder.foobar({name: "passed_option"})

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)

    assert_equal 1, operations.size
    assert_equal({"name" => "passed_option", "operation" => "foobar"}, operations.first)
  end

  test "should json-ify operations" do
    @operation_builder.add_operation_method("foobar")
    @operation_builder.foobar({name: "passed_option"})
    assert_equal("[{\"name\":\"passed_option\",\"operation\":\"foobar\"}]", @operation_builder.to_json)
  end

  test "should apply! many operations" do
    @operation_builder.apply!({name: "passed_option"})

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 1, operations.size
    assert_equal({"name" => "passed_option"}, operations.first)
  end

  test "should apply! many operations from a string" do
    @operation_builder.apply!(JSON.generate({name: "passed_option"}))

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 1, operations.size
    assert_equal({"name" => "passed_option"}, operations.first)
  end

  test "should apply! many operations from an array" do
    @operation_builder.apply!([{name: "passed_option_1"}, {name: "passed_option_2"}])

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 2, operations.size
    assert_equal({"name" => "passed_option_1"}, operations.first)
    assert_equal({"name" => "passed_option_2"}, operations.last)
  end

  test "should apply! many operations from a JSON-stringified array" do
    @operation_builder.apply!('[{"name": "passed_option_1"}, {"name": "passed_option_2"}]')

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 2, operations.size
    assert_equal({"name" => "passed_option_1"}, operations.first)
    assert_equal({"name" => "passed_option_2"}, operations.last)
  end

  test "should not apply! anything if no operation was passed" do
    @operation_builder.apply!
    @operation_builder.apply!("[]")
    @operation_builder.apply!([])

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 0, operations.size
  end

  test "operations payload should omit empty operations" do
    @operation_builder.add_operation_method("foobar")
    payload = @operation_builder.operations_payload
    assert_equal([], payload)
  end

  test "operations payload should camelize keys" do
    @operation_builder.add_operation_method("foo_bar")
    @operation_builder.foo_bar({beep_boop: "passed_option"})
    assert_equal([{"operation" => "fooBar", "beepBoop" => "passed_option"}], @operation_builder.operations_payload)
  end

  test "should take first argument as selector" do
    @operation_builder.add_operation_method("inner_html")

    @operation_builder.inner_html("#smelly", html: "<span>I rock</span>")

    operations = [{"operation" => "innerHtml", "html" => "<span>I rock</span>", "selector" => "#smelly"}]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should use previously passed selector in next operation" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.add_operation_method("set_focus")

    @operation_builder.set_focus("#smelly").inner_html(html: "<span>I rock</span>")

    operations = [
      {"operation" => "setFocus", "selector" => "#smelly"},
      {"operation" => "innerHtml", "html" => "<span>I rock</span>", "selector" => "#smelly"}
    ]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should clear previous_selector after calling reset!" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.inner_html(selector: "#smelly", html: "<span>I rock</span>")

    @operation_builder.reset!

    @operation_builder.inner_html(html: "<span>winning6</span>")

    assert_equal([{"operation" => "innerHtml", "html" => "<span>winning6</span>"}], @operation_builder.operations_payload)
  end

  test "should use previous_selector if present and should use `selector` if explicitly provided" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.add_operation_method("set_focus")

    @operation_builder.set_focus("#smelly").inner_html(html: "<span>I rock</span>").inner_html(html: "<span>I rock too</span>", selector: "#smelly2")

    operations = [
      {"operation" => "setFocus", "selector" => "#smelly"},
      {"operation" => "innerHtml", "html" => "<span>I rock</span>", "selector" => "#smelly"},
      {"operation" => "innerHtml", "html" => "<span>I rock too</span>", "selector" => "#smelly2"}
    ]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html option from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(html: death)

    operations = [{"operation" => "innerHtml", "html" => "I rock"}]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html option with selector from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(death, html: death)

    operations = [{"operation" => "innerHtml", "html" => "I rock", "selector" => "#death"}]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html and dom_id options from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(death)

    operations = [{"operation" => "innerHtml", "html" => "I rock", "domId" => "death"}]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html and dom_id options from Life object" do
    @operation_builder.add_operation_method("inner_html")
    life = Life.new

    @operation_builder.inner_html(life)

    operations = [{"operation" => "innerHtml", "html" => "You go, girl", "domId" => "life"}]

    assert_equal(operations, @operation_builder.operations_payload)
  end
end
