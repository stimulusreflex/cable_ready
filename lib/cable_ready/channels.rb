# frozen_string_literal: true

require "thread/local"
require_relative "channel"

module CableReady
  # This class is a thread local singleton: CableReady::Channels.instance
  # SEE: https://github.com/socketry/thread-local/tree/master/guides/getting-started
  class Channels
    extend Thread::Local

    attr_accessor :operations

    def initialize
      @channels = {}
      @operations = {}
<<<<<<< HEAD
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
        play_sound
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
=======
>>>>>>> master
    end

    def [](identifier)
      @channels[identifier] ||= CableReady::Channel.new(identifier)
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
