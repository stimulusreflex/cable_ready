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
      @channels.values.map(&:broadcast)
      clear
    end
  end
end
