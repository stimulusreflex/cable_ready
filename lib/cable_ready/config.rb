# frozen_string_literal: true

require "monitor"
require "observer"
require "singleton"

module CableReady
  # This class is a process level singleton shared by all threads: CableReady::Config.instance
  class Config
    include Singleton
    include Observable

    def initialize
      @lock = Monitor.new
      @operation_definitions = {}
      default_operation_names.each { |name| add_operation_definition name }
    end

    def operation_names
      operation_definitions.keys
    end

    # TODO: NATE: what are we doing with the passed options???
    #             perhaps we can omit and simply have a list of operation names?
    def add_operation_definition(name, options = {})
      @lock.synchronize do
        yield options if block_given? # TODO: NATE: what are we doing with these options???
        operation_definitions[name.to_sym] = options # TODO: NATE: what are we doing with these options???
        notify_observers name.to_sym
      end
    end

    def default_operation_names
      %i[
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
        push_state
        remove
        remove_attribute
        remove_css_class
        remove_storage_item
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
      ].freeze
    end

    private

    attr_reader :operation_definitions
  end
end
