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

    def broadcast(*identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .select { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast(clear) }
          channels.each { |channel| @channels.except!(channel.identifier) if clear }
        end
    end

    def broadcast_to(model, *identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .reject { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast_to(model, clear) }
          channels.each { |channel| @channels.except!(channel.identifier) if clear }
        end
    end
  end
end
