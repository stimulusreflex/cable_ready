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
    mock_server.expects(:broadcast).with(User, {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with(user.to_global_id, {changed: ["name", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    user.update(name: "Jane Doe")
  end

  test "updates the parent when it is touched" do
    team = Team.create
    user = team.users.create(name: "Ada Lovelace")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with(user.to_global_id, {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with("gid://dummy/Team/1:users", {changed: ["name", "updated_at"]}).once
    mock_server.expects(:broadcast).with(Team, {changed: ["id", "created_at", "updated_at"]}).once
    mock_server.expects(:broadcast).with(team.to_global_id, {changed: ["id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    user.update(name: "Jane Doe")
  end

  test "updates a has_one association when it is added" do
    mock_server = mock("server")
    mock_server.expects(:broadcast).with(Supplier, {}).once
    mock_server.expects(:broadcast).with("gid://dummy/Supplier/1:account", {changed: ["id", "account_number", "supplier_id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)
    supplier = Supplier.create(name: "ACME Inc.")

    supplier.create_account(account_number: "12345")
  end

  test "updates a has_one association when it is destroyed" do
    supplier = Supplier.create(name: "ACME Inc.")
    account = supplier.create_account(account_number: "12345")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with("gid://dummy/Supplier/1:account", {changed: ["id", "account_number", "supplier_id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    account.destroy
  end

  test "updates a has_one association when it is updated" do
    supplier = Supplier.create(name: "ACME Inc.")
    account = supplier.create_account(account_number: "12345")

    mock_server = mock("server")
    mock_server.expects(:broadcast).with("gid://dummy/Supplier/1:account", {changed: ["account_number", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    account.update(account_number: "54321")
  end

  test "respects :on to specify persistence methods" do
    mock_server = mock("server")

    ActionCable.stubs(:server).returns(mock_server)

    mock_server.expects(:broadcast).with(Topic, {}).once
    topic = Topic.create(title: "Reactive Rails with Hotwire")

    mock_server.expects(:broadcast).with(topic.to_global_id, {}).never
    topic.update(title: "Reactive Rails with CableReady")
  end

  test "respects :if on enable_cable_ready_updates" do
    mock_server = mock("server")

    ActionCable.stubs(:server).returns(mock_server)

    section = Section.create
    section.updates_enabled = true

    mock_server.expects(:broadcast).with(Section, {changed: ["title", "updated_at", "updates_enabled"]}).once
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

  test "updates the collection when a file is attached" do
    mock_server = mock("server")
    image = File.open(Rails.root.join("test", "fixtures", "files", "dugong.jpg"))
    dugong = Dugong.create

    mock_server.expects(:broadcast).with("gid://dummy/Dugong/1:images", {changed: ["id", "name", "record_type", "record_id", "blob_id", "created_at"]}).once
    ActionCable.stubs(:server).returns(mock_server)

    dugong.images.attach(io: image, filename: "dugong.jpg")
  end

  test "updates the collection when a file is destroyed" do
    mock_server = mock("server")
    image = File.open(Rails.root.join("test", "fixtures", "files", "dugong.jpg"))
    dugong = Dugong.create
    dugong.images.attach(io: image, filename: "dugong.jpg")

    mock_server.expects(:broadcast).with("gid://dummy/Dugong/1:images", {changed: ["id", "name", "record_type", "record_id", "blob_id", "created_at"]}).once
    ActionCable.stubs(:server).returns(mock_server)

    dugong.images.first.destroy
  end

  test "updates the collection when an item is added to a STI collection" do
    mock_server = mock("server")

    mock_server.expects(:broadcast).with("gid://dummy/Section/1:blocks", {changed: ["id", "body", "section_id", "created_at", "updated_at"]}).once
    mock_server.expects(:broadcast).with("gid://dummy/Section/1:blocks", {changed: ["id", "body", "type", "section_id", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)

    section = Section.create

    # adding a record to the base type triggers an update
    section.blocks << Block.new(body: "Lorem")

    # adding a record to a subtype triggers an update
    section.blocks << Comment.new(body: "Lorem")

    assert section.blocks.count == 2
  end

  # standard:disable Lint/ConstantDefinitionInBlock
  test "warns about deprecated enable_updates class method" do
    assert_output(nil, /DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` class method will be removed from a future version of CableReady 5/) do
      class TestEnableUpdates < ActiveRecord::Base
        include CableReady::Updatable

        enable_updates
      end
    end
  end

  test "warns about deprecated skip_updates class method" do
    assert_output(nil, /DEPRECATED: please use `skip_cable_ready_updates` instead. The `skip_updates` class method will be removed from a future version of CableReady 5/) do
      class TestSkipUpdates < ActiveRecord::Base
        include CableReady::Updatable

        enable_cable_ready_updates
      end

      assert_raises {
        TestSkipUpdates.skip_updates do
          raise
        end
      }
    end
  end

  test "warns about deprecated enable_updates option on relation" do
    assert_output(nil, /DEPRECATED: please use `enable_cable_ready_updates` instead. The `enable_updates` option will be removed from a future version of CableReady 5/) do
      class Something < ActiveRecord::Base
      end

      class TestEnableUpdatesOption < ActiveRecord::Base
        include CableReady::Updatable

        enable_cable_ready_updates

        has_many :something, enable_updates: true
      end
    end
  end
  # standard:enable Lint/ConstantDefinitionInBlock

  test "resolves inverse_of correctly" do
    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {}).once
    mock_server.expects(:broadcast).with("gid://dummy/User/1:actions", {changed: ["id", "listing_id", "kind", "created_at", "updated_at"]}).once
    mock_server.expects(:broadcast).with("gid://dummy/Listing/1:actions", {changed: ["id", "listing_id", "kind", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)
    user = User.create(name: "John Doe")
    listing = user.listings.create(name: "test listing")

    listing.actions.create(kind: "publish")
  end

  test "resolves inverse_of for has_many :through correctly" do
    mock_server = mock("server")
    mock_server.expects(:broadcast).with(User, {}).once
    mock_server.expects(:broadcast).with("gid://dummy/User/1:actions", {changed: ["id", "listing_id", "kind", "created_at", "updated_at"]}).once
    mock_server.expects(:broadcast).with("gid://dummy/Listing/1:actions", {changed: ["id", "listing_id", "kind", "created_at", "updated_at"]}).once

    ActionCable.stubs(:server).returns(mock_server)
    user = User.create(name: "John Doe")
    listing = user.listings.create(name: "test listing")

    listing.actions.create(kind: "publish")
  end
end
