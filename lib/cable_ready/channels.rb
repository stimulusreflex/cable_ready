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

    def broadcast(*identifiers)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .select { |channel| channel.identifier.is_a?(String) }
        .each(&:broadcast)
      clear
    end

    def broadcast_to(model, *identifiers)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .reject { |channel| channel.identifier.is_a?(String) }
        .each { |channel| @channels[channel.identifier].broadcast_to model }
      clear
    end
  end
end
