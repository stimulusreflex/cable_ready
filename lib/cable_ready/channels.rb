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

    def broadcast(*identifiers)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .select { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each(&:broadcast)
          channels.each { |channel| @channels.except!(channel.identifier) }
        end
    end

    def broadcast_to(model, *identifiers)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .reject { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast_to(model) }
          channels.each { |channel| @channels.except!(channel.identifier) }
        end
    end
  end
end
