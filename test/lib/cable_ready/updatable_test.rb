# frozen_string_literal: true

require "test_helper"

class CableReady::UpdatableTest < ActiveSupport::TestCase
  test "includes the module automatically in associated models" do
    user = User.create(name: "John Doe")

    post = user.posts.build
    assert post.class < CableReady::Updatable
  end

  test "updates the collection when an item is added" do
    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {}).once
    mock_server.expects(:broadcast).with("gid://dummy/User/1:posts", {changed: ["id", "title", "user_id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)
    user = User.create(name: "John Doe")

    user.posts.create(title: "Lorem")
  end

  test "updates the collection when an item is destroyed" do
    user = User.create(name: "John Doe")
    post = user.posts.create(title: "Lorem")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with("gid://dummy/User/1:posts", {changed: ["id", "title", "user_id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    post.destroy
  end

  test "updates the collection when an item is updated" do
    user = User.create(name: "John Doe")
    post = user.posts.create(title: "Lorem")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with("gid://dummy/User/1:posts", {changed: ["title", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    post.update(title: "Ipsum")
  end

  test "updates the model when it is updated" do
    user = User.create(name: "John Doe")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {}).once
    mock_server.expects(:broadcast).with(user.to_global_id, {changed: ["name", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    user.update(name: "Jane Doe")
  end

  test "updates the parent when it is touched" do
    team = Team.create
    user = team.users.create(name: "Ada Lovelace")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {}).once
    mock_server.expects(:broadcast).with(user.to_global_id, {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with("gid://dummy/Team/1:users", {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with(Team, {}).once
    mock_server.expects(:broadcast).with(team.to_global_id, {changed: ["id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    user.update(name: "Jane Doe")
  end

  test "respects :on to specify persistence methods" do
    mock_server = mock("server")

    ActionCable.stubs(:server).returns(mock_server)

    mock_server.expects(:broadcast).with(Topic, {}).once
    topic = Topic.create(title: "Reactive Rails with Hotwire")

    mock_server.expects(:broadcast).with(topic.to_global_id, {}).never
    topic.update(title: "Reactive Rails with CableReady")
  end

  test "respects :if on enable_updates" do
    mock_server = mock("server")

    ActionCable.stubs(:server).returns(mock_server)

    section = Section.create
    section.updates_enabled = true

    mock_server.expects(:broadcast).with(Section, {}).once
    mock_server.expects(:broadcast).with(section.to_global_id, {changed: ["title", "updated_at", "updates_enabled"]}).once
    section.update(title: "First Section")
  end

  test "updates any GlobalID-able entity" do
    entity = GlobalIdableEntity.new

    mock_server = mock("server")
    mock_server.expects(:broadcast).with(GlobalIdableEntity, {}).once
    mock_server.expects(:broadcast).with(entity.to_global_id, {}).once

    ActionCable.stubs(:server).returns(mock_server)

    entity.fake_update
  end
end
