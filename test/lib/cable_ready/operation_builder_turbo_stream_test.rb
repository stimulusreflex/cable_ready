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

class CableReady::OperationBuilderTurboStreamTest < ActiveSupport::TestCase
  setup do
    CableReady.config.operation_mode = :turbo_stream
    @operation_builder = CableReady::OperationBuilder.new("test")
  end

  teardown do
    CableReady.config.operation_mode = :cable_ready
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

  test "should operations convert operations to Turbo Stream / HTML" do
    @operation_builder.add_operation_method("foobar")
    @operation_builder.foobar({name: "passed_option"})

    # the Turbo Helper current don't supoport custom additional attributes
    # assert_equal("<turbo-stream action=\"foobar\" targets=\"body\" name=\"passed_option\"><template></template></turbo-stream>", @operation_builder.to_turbo_stream)
    # assert_equal("<turbo-stream action=\"foobar\" targets=\"body\" name=\"passed_option\"><template></template></turbo-stream>", @operation_builder.to_html)

    assert_equal("<turbo-stream action=\"foobar\" targets=\"body\"><template></template></turbo-stream>", @operation_builder.to_turbo_stream)
    assert_equal("<turbo-stream action=\"foobar\" targets=\"body\"><template></template></turbo-stream>", @operation_builder.to_html)
  end

  test "operations payload should omit empty operations" do
    @operation_builder.add_operation_method("foobar")
    assert_equal([], @operation_builder.operations_payload)
    assert_equal("", @operation_builder.to_html)
    assert_equal("", @operation_builder.to_turbo_stream)
  end

  test "operations payload should camelize keys" do
    @operation_builder.add_operation_method("foo_bar")
    @operation_builder.foo_bar({beep_boop: "passed_option"})

    # the Turbo Helper current don't supoport custom additional attributes
    # operations = ["<turbo-stream action=\"fooBar\" targets=\"body\" beep-boop=\"passed_option\"><template></template></turbo-stream>"]
    operations = ["<turbo-stream action=\"fooBar\" targets=\"body\"><template></template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should take first argument as selector" do
    @operation_builder.add_operation_method("inner_html")

    @operation_builder.inner_html("#smelly", html: "<span>I rock</span>")

    operations = ["<turbo-stream action=\"replace\" target=\"smelly\"><template><span>I rock</span></template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should use previously passed selector in next operation" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.add_operation_method("set_focus")

    @operation_builder.set_focus("#smelly").inner_html(html: "<span>I rock</span>")

    operations = [
      "<turbo-stream action=\"setFocus\" target=\"smelly\"><template></template></turbo-stream>",
      "<turbo-stream action=\"replace\" target=\"smelly\"><template><span>I rock</span></template></turbo-stream>"
    ]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should clear previous_selector after calling reset!" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.inner_html(selector: "#smelly", html: "<span>I rock</span>")

    @operation_builder.reset!

    @operation_builder.inner_html(html: "<span>winning</span>")

    operations = ["<turbo-stream action=\"replace\" targets=\"body\"><template><span>winning</span></template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should use previous_selector if present and should use `selector` if explicitly provided" do
    @operation_builder.add_operation_method("inner_html")
    @operation_builder.add_operation_method("set_focus")

    @operation_builder.set_focus("#smelly").inner_html(html: "<span>I rock</span>").inner_html(html: "<span>I rock too</span>", selector: "#smelly2")

    operations = [
      "<turbo-stream action=\"setFocus\" target=\"smelly\"><template></template></turbo-stream>",
      "<turbo-stream action=\"replace\" target=\"smelly\"><template><span>I rock</span></template></turbo-stream>",
      "<turbo-stream action=\"replace\" target=\"smelly2\"><template><span>I rock too</span></template></turbo-stream>",
    ]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html option from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(html: death)

    operations = ["<turbo-stream action=\"replace\" targets=\"body\"><template>I rock</template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html option with selector from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(death, html: death)

    operations = ["<turbo-stream action=\"replace\" target=\"death\"><template>I rock</template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html and dom_id options from Death object" do
    @operation_builder.add_operation_method("inner_html")
    death = Death.new

    @operation_builder.inner_html(death)

    operations = ["<turbo-stream action=\"replace\" target=\"death\"><template>I rock</template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should pull html and dom_id options from Life object" do
    @operation_builder.add_operation_method("inner_html")
    life = Life.new

    @operation_builder.inner_html(life)

    operations = ["<turbo-stream action=\"replace\" target=\"life\"><template>You go, girl</template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end

  test "should put operation[message] into the tempalte tag" do
    @operation_builder.add_operation_method("console_log")

    @operation_builder.console_log(message: "Hello Console", level: "warn")

    # the Turbo Helper current don't supoport custom additional attributes
    # operations = ["<turbo-stream action=\"consoleLog\" targets=\"body\" level="warn"><template>Hello Console</template></turbo-stream>"]
    operations = ["<turbo-stream action=\"consoleLog\" targets=\"body\"><template>Hello Console</template></turbo-stream>"]

    assert_equal(operations, @operation_builder.operations_payload)
  end
end
