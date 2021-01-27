# frozen_string_literal: true

require "thread/local"
require_relative "channel"

module CableReady
  # This class is a thread local singleton: CableReady::Channels.instance
  # SEE: https://github.com/socketry/thread-local/tree/master/guides/getting-started
  class Channels
    include CableReady::StreamName
    extend Thread::Local

    attr_accessor :operations

    def initialize
      @channels = {}
      @operations = {}
    end

    def [](identifier)
      stream_name = stream_name_from(identifier)
      @channels[stream_name] ||= CableReady::Channel.new(stream_name)
    end

    def broadcast(*identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .select { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast(clear: clear) }
          channels.each { |channel| @channels.except!(channel.identifier) if clear }
        end
    end

    def broadcast_to(model, *identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .reject { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast_to(model, clear: clear) }
          channels.each { |channel| @channels.except!(channel.identifier) if clear }
        end
    end
  end
end
