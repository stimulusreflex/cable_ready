require "test_helper"
require "generators/cable_ready_channel/cable_ready_channel_generator"

class CableReadyChannelGeneratorTest < Rails::Generators::TestCase
  tests CableReadyChannelGenerator
  destination Rails.root.join('tmp/generators')
  setup :prepare_destination

  # test "generator runs without errors" do
  #   assert_nothing_raised do
  #     run_generator ["arguments"]
  #   end
  # end
end
