require_relative "channel"

module CableReady
  class Channels
    def initialize
      @channels = {}
    end

    def [](channel_name, options = {})
      @channels[channel_name] ||= CableReady::Channel.new(channel_name, options)
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
