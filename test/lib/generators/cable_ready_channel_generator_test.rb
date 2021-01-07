require "test_helper"
require "generators/cable_ready_channel/cable_ready_channel_generator"

class CableReadyChannelGeneratorTest < Rails::Generators::TestCase
  destination File.expand_path("../tmp", __dir__)
  setup :prepare_destination
  tests CableReadyChannelGenerator

  # test "generator runs without errors" do
  #   run_generator ["Foo"]

  #   assert_file "app/channels/foo_channel.rb"
  # end
end
