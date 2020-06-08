# frozen_string_literal: true

require_relative "channel"

module CableReady
  class Channels
    include Singleton
    attr_accessor :tools

    def self.configure
      yield CableReady::Channels.instance if block_given?
    end

    def initialize
      @channels = {}
      @tools = [:add_css_class, :dispatch_event, :inner_html, :insert_adjacent_html, :insert_adjacent_text, :morph, :outer_html, :remove, :remove_attribute, :remove_css_class, :set_attribute, :set_cookie, :set_dataset_property, :set_property, :set_style, :set_styles, :set_value]
    end

    def add_tool(tool)
      @tools << tool.to_sym
    end

    def [](channel_name)
      @channels[channel_name] ||= CableReady::Channel.new(channel_name, tools.uniq)
    end

    def clear
      @channels = {}
    end

    def broadcast
      @channels.values.map(&:broadcast)
      clear
    end
  end
end
