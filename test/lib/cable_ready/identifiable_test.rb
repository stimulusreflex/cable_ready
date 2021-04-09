# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

class User
  include ActiveModel::Model

  attr_accessor :id
end

class CableReady::IdentifiableTest < ActiveSupport::TestCase
  include CableReady::Identifiable

  test "should handle nil" do
    assert_equal "#", dom_id(nil)
  end

  test "should work with strings" do
    assert_equal "#users", dom_id("users")
    assert_equal "#users", dom_id("users  ")
    assert_equal "#users", dom_id("  users  ")
  end

  test "should work with symbols" do
    assert_equal "#users", dom_id(:users)
    assert_equal "#active_users", dom_id(:active_users)
  end

  test "should just return one hash" do
    assert_equal "#users", dom_id("users")
    assert_equal "#users", dom_id("#users")
    assert_equal "#users", dom_id("##users")
  end

  test "should strip prefixes" do
    assert_equal "#active_users", dom_id("  users ", "     active    ")
    assert_equal "#all_active_users", dom_id(" users  ", "  all_active ")
  end

  test "should not include provided prefix if prefix is nil" do
    assert_equal "#users", dom_id("users", nil)
  end

  test "should work with ActiveRecord::Relation" do
    relation = mock("ActiveRecord::Relation")

    relation.stubs(:is_a?).with(ActiveRecord::Relation).returns(true).at_least_once
    relation.stubs(:is_a?).with(ActiveRecord::Base).never
    relation.stubs(:model_name).returns(OpenStruct.new(plural: "users"))

    assert_equal "#users", dom_id(relation)
    assert_equal "#users", dom_id(relation, nil)
    assert_equal "#active_users", dom_id(relation, "active")
  end

  test "should work with ActiveRecord::Base" do
    User.any_instance.stubs(:is_a?).with(ActiveRecord::Relation).returns(false)
    User.any_instance.stubs(:is_a?).with(ActiveRecord::Base).returns(true)

    assert_equal "#new_user", dom_id(User.new(id: nil))

    user = User.new(id: 42)

    assert_equal "#user_42", dom_id(user)
    assert_equal "#user_42", dom_id(user, nil)
    assert_equal "#all_active_user_42", dom_id(user, "all_active")

    user = User.new(id: 99)

    assert_equal "#user_99", dom_id(user)
    assert_equal "#user_99", dom_id(user, nil)
    assert_equal "#all_active_user_99", dom_id(user, "all_active")
  end
end
