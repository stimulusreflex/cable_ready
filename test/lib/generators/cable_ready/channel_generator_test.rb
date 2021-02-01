# frozen_string_literal: true

require "test_helper"
require "generators/cable_ready/channel_generator"

class CableReady::ChannelGeneratorTest < Rails::Generators::TestCase
  include ::GeneratorTestHelpers

  tests CableReady::ChannelGenerator
  destination File.expand_path("../../../../tmp/dummy", __dir__)

  prepare_destination
  create_sample_app

  MiniTest.after_run do
    remove_sample_app
  end

  test "should generate channel with the same resource name and stimulus controller" do
    run_generator ["user", "--broadcast-to", "--resource=user", "--stimulus"]

    assert_file "app/channels/user_channel.rb" do |content|
      assert_match /class\ UserChannel\ \</, content
      assert_match /stream_for\ User\.find\(params\[\:id\]\)/, content
    end

    assert_file "app/javascript/channels/user_channel.js", /"UserChannel"/
    assert_file "app/javascript/controllers/user_controller.js", /\'UserChannel\'/
  end

  test "should generate channel with different resource name" do
    run_generator ["my_name", "--broadcast-to", "--resource=under_scored_resource_name", "--no-stimulus"]

    assert_file "app/channels/my_name_channel.rb" do |content|
      assert_match /class\ MyNameChannel\ \</, content
      assert_match /stream_for\ UnderScoredResourceName\.find\(params\[\:id\]\)/, content
    end

    assert_file "app/javascript/channels/my_name_channel.js", /"MyNameChannel"/
    assert_no_file "app/javascript/controllers/my_name_controller.js"
  end

  test "should not generate stimulus controller if not requested" do
    run_generator ["comment", "--broadcast-to", "--resource=comment", "--no-stimulus"]

    assert_file "app/channels/comment_channel.rb"
    assert_file "app/javascript/channels/comment_channel.js"
    assert_no_file "app/javascript/controllers/comment_controller.js"
  end

  test "should run the generator when streaming from identifier" do
    run_generator ["page", "--no-broadcast-to", "--identifier=page"]

    assert_file "app/channels/page_channel.rb" do |content|
      assert_match /PageChannel/, content
      assert_match /stream_from\ \"page\"/, content
    end

    assert_file "app/javascript/channels/page_channel.js" do |content|
      assert_match /"PageChannel"/, content
      assert_match /import\ CableReady/, content
      assert_match /if\ \(data\.cableReady\)\ CableReady\.perform\(data\.operations\)/, content
    end
  end

  test "should run the generator when streaming without resource and different identifier" do
    run_generator ["my_page", "--no-broadcast-to", "--identifier=ThisIsMyPage"]

    assert_file "app/channels/my_page_channel.rb" do |content|
      assert_match /MyPageChannel/, content
      assert_match /stream_from\ \"this_is_my_page\"/, content
    end

    assert_file "app/javascript/channels/my_page_channel.js" do |content|
      assert_match /"MyPageChannel"/, content
      assert_match /import\ CableReady/, content
      assert_match /if\ \(data\.cableReady\)\ CableReady\.perform\(data\.operations\)/, content
    end
  end

  # some tests without generator options to simulate the inputs passed via cli

  test "should generate channel with the same resource name and stimulus controller (without options)" do
    CableReady::ChannelGenerator.any_instance.stubs(:using_broadcast_to?).returns(true)
    CableReady::ChannelGenerator.any_instance.stubs(:ask_for_resource).returns("Post")
    CableReady::ChannelGenerator.any_instance.stubs(:using_stimulus?).returns(true)

    run_generator ["post"]

    assert_file "app/channels/post_channel.rb" do |content|
      assert_match /class\ PostChannel\ \</, content
      assert_match /stream_for\ Post\.find\(params\[\:id\]\)/, content
    end

    assert_file "app/javascript/channels/post_channel.js", /PostChannel/
    assert_file "app/javascript/controllers/post_controller.js", /\'PostChannel\'/
  end


  test "should not generate stimulus controller if not requested (without options)" do
    CableReady::ChannelGenerator.any_instance.stubs(:using_broadcast_to?).returns(true)
    CableReady::ChannelGenerator.any_instance.stubs(:ask_for_resource).returns("Admin")
    CableReady::ChannelGenerator.any_instance.stubs(:using_stimulus?).returns(false)

    run_generator ["admin"]

    assert_file "app/channels/admin_channel.rb"
    assert_file "app/javascript/channels/admin_channel.js"
    assert_no_file "app/javascript/controllers/admin_controller.js"
  end

  test "should run the generator when streaming from identifier (without options)" do
    CableReady::ChannelGenerator.any_instance.stubs(:using_broadcast_to?).returns(false)
    CableReady::ChannelGenerator.any_instance.stubs(:ask_for_identifier).returns("index_identifier")

    run_generator ["index"]

    assert_file "app/channels/index_channel.rb" do |content|
      assert_match /IndexChannel/, content
      assert_match /stream_from\ \"index_identifier\"/, content
    end

    assert_file "app/javascript/channels/index_channel.js", /"IndexChannel"/
  end
end
