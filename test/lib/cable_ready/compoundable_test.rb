# frozen_string_literal: true

require "test_helper"
require_relative "../../../lib/cable_ready"

class CableReady::CompoundableTest < ActiveSupport::TestCase
  include CableReady::Compoundable

  test "compounds an ActiveRecord::Base" do
    user = User.create(name: "Alan Turing")

    assert_equal "gid://dummy/User/1", compound([user])
  end

  test "compounds any GlobalId-able entity" do
    entity = GlobalIdableEntity.new

    assert_equal "gid://dummy/GlobalIdableEntity/fake-id", compound([entity])
  end

  test "compounds any combination of globalid-able and strings" do
    user = User.create(name: "Alan Turing")

    assert_equal "gid://dummy/User/1:enigma", compound([user, :enigma])
  end
end
