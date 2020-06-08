# frozen_string_literal: true

require_relative "channel"

module CableReady
  class Channels
    def initialize
      @channels = {}
    end

    def [](identifier)
      @channels[identifier] ||= CableReady::Channel.new(identifier)
    end

    def clear
      @channels = {}
    end

    def broadcast(identifier = nil)
      if identifier
        @channels[identifier].send(:broadcast)
      else
        @channels.values.select { |channel| channel.identifier.is_a?(String) }.each(&:broadcast)
      end
      clear
    end

    def broadcast_to(model, identifier = nil)
      if identifier
        @channels[identifier].send(:broadcast_to, model)
      else
        @channels.values.reject { |channel| channel.identifier.is_a?(String) }.each do |channel|
          @channels[channel.identifier].send(:broadcast_to, model)
        end
      end
      clear
    end
  end
end
