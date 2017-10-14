require_relative "channel"

module CableReady
  class Channels
    def initialize
      @channels = {}
    end

    def [](channel_name)
      @channels[channel_name] ||= CableReady::Channel.new(channel_name)
    end

    def clear
      @channels = {}
    end

    def broadcast
      @channels.each do |channel_name, channel|
        ActionCable.server.broadcast channel_name,
          "cableReady" => true,
          "operations" => channel.operations.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      end
      clear
    end
  end
end
