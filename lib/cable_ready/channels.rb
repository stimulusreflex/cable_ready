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

    def broadcast(channel = nil)
      channel ? @channels[channel].send(:broadcast) : @channels.values.each(&:broadcast)
      clear
    end

    def broadcast_to(model, channel = nil)
      if channel
        @channels[channel].send(:broadcast_to, channel, model)
      else
        @channels.keys.each do |key|
          @channels[key].send(:broadcast_to, key, model)
        end
      end
      clear
    end
  end
end
