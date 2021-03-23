# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

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

    assert_equal 1, operations["foobar"].size
    assert_equal({"name" => "passed_option"}, operations["foobar"].first)
  end

  test "should json-ify operations" do
    @operation_builder.add_operation_method("foobar")
    @operation_builder.foobar({name: "passed_option"})
    assert_equal("{\"foobar\":[{\"name\":\"passed_option\"}]}", @operation_builder.to_json)
  end

  test "should apply many operations" do
    @operation_builder.apply(foobar: [{name: "passed_option"}])

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 1, operations["foobar"].size
    assert_equal({"name" => "passed_option"}, operations["foobar"].first)
  end

  test "should apply many operations from a string" do
    @operation_builder.apply(JSON.generate({foobar: [{name: "passed_option"}]}))

    operations = @operation_builder.instance_variable_get(:@enqueued_operations)
    assert_equal 1, operations["foobar"].size
    assert_equal({"name" => "passed_option"}, operations["foobar"].first)
  end

  test "operations payload should omit empty operations" do
    @operation_builder.add_operation_method("foobar")
    payload = @operation_builder.operations_payload
    assert_equal({}, payload)
  end

  test "operations payload should camelize keys" do
    @operation_builder.add_operation_method("foobar")
    @operation_builder.foobar({beep_boop: "passed_option"})
    assert_equal({"foobar" => [{"beepBoop" => "passed_option"}]}, @operation_builder.operations_payload)
  end
end
