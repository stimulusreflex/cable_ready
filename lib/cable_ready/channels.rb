# frozen_string_literal: true

require_relative "channel"

module CableReady
  class Channels
    include Singleton
    attr_accessor :operations

    def self.configure
      yield CableReady::Channels.instance if block_given?
    end

    def initialize
      @channels = {}
      @operations = {}
      %i[
        append
        add_css_class
        clear_storage
        console_log
        dispatch_event
        inner_html
        insert_adjacent_html
        insert_adjacent_text
        morph
        notification
        outer_html
        prepend
        push_state
        remove
        remove_attribute
        remove_css_class
        remove_storage_item
        replace
        set_attribute
        set_cookie
        set_dataset_property
        set_focus
        set_property
        set_storage_item
        set_style
        set_styles
        set_value
        text_content
      ].each do |operation|
        add_operation operation
      end
    end

    def add_operation(operation)
      @operations[operation] = ->(options = {}) do
        yield(options) if block_given?
        enqueue_operation(operation, options)
      end
    end

    def [](identifier)
      @channels[identifier] ||= CableReady::Channel.new(identifier, operations)
    end

    def broadcast(*identifiers, clear: true)
      mutex.synchronize do
        @channels.values
          .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
          .select { |channel| channel.identifier.is_a?(String) }
          .tap do |channels|
            channels.each { |channel| @channels[channel.identifier].channel_broadcast(clear) }
            channels.each { |channel| @channels.except!(channel.identifier) if clear }
          end
      end
    end

    def broadcast_to(model, *identifiers, clear: true)
      mutex.synchronize do
        @channels.values
          .reject { |channel| identifiers.any? && identifiers.exclude?(channel.identifier) }
          .reject { |channel| channel.identifier.is_a?(String) }
          .tap do |channels|
            channels.each { |channel| @channels[channel.identifier].channel_broadcast_to(model, clear) }
            channels.each { |channel| @channels.except!(channel.identifier) if clear }
          end
      end
    end

    private

    def mutex
      @mutex ||= Mutex.new
    end
  end
end
