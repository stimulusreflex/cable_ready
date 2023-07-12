# frozen_string_literal: true

require "monitor"
require "observer"
require "singleton"

require "active_support/core_ext/numeric/time"

module CableReady
  # This class is a process level singleton shared by all threads: CableReady::Config.instance
  class Config
    include MonitorMixin
    include Observable
    include Singleton

    attr_accessor :on_failed_sanity_checks, :broadcast_job_queue, :precompile_assets, :updatable_debounce_time, :updatable_debounce_adapter
    attr_writer :verifier_key

    def on_new_version_available
      warn "NOTICE: The `config.on_new_version_available` option has been removed from the CableReady initializer. You can safely remove this option from your initializer."
    end

    def on_new_version_available=(_)
      warn "NOTICE: The `config.on_new_version_available` option has been removed from the CableReady initializer. You can safely remove this option from your initializer."
    end

    def initialize
      super
      @operation_names = Set.new(default_operation_names)
      @on_failed_sanity_checks = :exit
      @broadcast_job_queue = :default
      @precompile_assets = true
      @updatable_debounce_time = 0.1.seconds
    end

    def observers
      @observer_peers&.keys || []
    end

    def verifier_key
      @verifier_key || Rails.application.key_generator.generate_key("cable_ready/verifier_key")
    end

    def operation_names
      @operation_names.to_a
    end

    def add_operation_name(name)
      synchronize do
        @operation_names << name.to_sym
        notify_observers name.to_sym
      end
    end

    def default_operation_names
      Set.new(%i[
        add_css_class
        append
        clear_storage
        console_log
        console_table
        dispatch_event
        go
        graft
        inner_html
        insert_adjacent_html
        insert_adjacent_text
        morph
        notification
        outer_html
        prepend
        push_state
        redirect_to
        reload
        remove
        remove_attribute
        remove_css_class
        remove_storage_item
        replace
        replace_state
        scroll_into_view
        set_attribute
        set_cookie
        set_dataset_property
        set_focus
        set_meta
        set_property
        set_storage_item
        set_style
        set_styles
        set_title
        set_value
        text_content
      ]).freeze
    end
  end
end
