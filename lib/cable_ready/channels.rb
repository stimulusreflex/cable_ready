# frozen_string_literal: true

require "thread/local"

require "active_support/core_ext/enumerable"

module CableReady
  # This class is a thread local singleton: CableReady::Channels.instance
  # SEE: https://github.com/socketry/thread-local/tree/master/guides/getting-started
  class Channels
    include Compoundable
    extend Thread::Local

    def initialize
      @channels = {}
    end

    def [](*keys)
      keys.select!(&:itself)
      identifier = (keys.many? || (keys.one? && keys.first.respond_to?(:to_global_id))) ? compound(keys) : keys.pop
      @channels[identifier] ||= CableReady::Channel.new(identifier)
    end

    def broadcast(*identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .select { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast(clear: clear) }
          channels.each { |channel| clear_channel(channel) if clear }
        end
    end

    def broadcast_to(model, *identifiers, clear: true)
      @channels.values
        .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
        .reject { |channel| channel.identifier.is_a?(String) }
        .tap do |channels|
          channels.each { |channel| @channels[channel.identifier].broadcast_to(model, clear: clear) }
          channels.each { |channel| clear_channel(channel) if clear }
        end
    end

    private

    def clear_channel(channel)
      @channels.except!(channel.identifier)
      observer = CableReady.config.observers.find { |o| o.try(:identifier) == channel.identifier }
      CableReady.config.delete_observer(observer) if observer
    end
  end
end
