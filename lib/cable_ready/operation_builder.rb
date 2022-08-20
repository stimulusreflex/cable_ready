# frozen_string_literal: true

module CableReady
  class OperationBuilder
    include Identifiable
    include Turbo::Streams::ActionHelper

    attr_reader :identifier, :previous_selector

    def self.finalizer_for(identifier)
      proc {
        channel = CableReady.config.observers.find { |o| o.try(:identifier) == identifier }
        CableReady.config.delete_observer channel if channel
      }
    end

    def initialize(identifier)
      @identifier = identifier

      reset!
      CableReady.config.operation_names.each { |name| add_operation_method name }
      CableReady.config.add_observer self, :add_operation_method
      ObjectSpace.define_finalizer self, self.class.finalizer_for(identifier)
    end

    def add_operation_method(name)
      return if respond_to?(name)
      singleton_class.public_send :define_method, name, ->(*args) {
        if args.one? && args.first.respond_to?(:to_operation_options) && [Array, Hash].include?(args.first.to_operation_options.class)
          case args.first.to_operation_options
          when Array
            selector, options = nil, args.first.to_operation_options
              .select { |e| e.is_a?(Symbol) && args.first.respond_to?("to_#{e}".to_sym) }
              .each_with_object({}) { |option, memo| memo[option.to_s] = args.first.send("to_#{option}".to_sym) }
          when Hash
            selector, options = nil, args.first.to_operation_options
          else
            raise TypeError, ":to_operation_options returned an #{args.first.to_operation_options.class.name}. Must be an Array or Hash."
          end
        else
          selector, options = nil, args.first || {} # 1 or 0 params
          selector, options = options, {} unless options.is_a?(Hash) # swap if only selector provided
          selector, options = args[0, 2] if args.many? # 2 or more params
          options.stringify_keys!
          options.each { |key, value| options[key] = value.send("to_#{key}".to_sym) if value.respond_to?("to_#{key}".to_sym) }
        end
        options["selector"] = selector if selector && options.exclude?("selector")
        options["selector"] = previous_selector if previous_selector && options.exclude?("selector")
        if options.include?("selector")
          @previous_selector = options["selector"]
          options["selector"] = identifiable?(previous_selector) ? dom_id(previous_selector) : previous_selector
        end
        options["operation"] = name.to_s.camelize(:lower)
        @enqueued_operations << options
        self
      }
    end

    def to_json(*args)
      @enqueued_operations.to_json(*args)
    end

    def to_turbo_stream
      operations_payload.join
    end

    def to_html
      to_turbo_stream
    end

    def apply!(operations = "[]")
      operations = begin
        JSON.parse(operations.is_a?(String) ? operations : operations.to_json)
      rescue JSON::ParserError
        {}
      end
      @enqueued_operations.concat(Array.wrap(operations))
      self
    end

    def operations_payload
      if ::CableReady.config.operation_mode == :turbo_stream
        def translate_operation_name(name)
          case name
          when "innerHtml" then "replace"
          else name
          end
        end

        def single_selector?(selector)
          selector.starts_with?("#")
        end

        def translate_selector(operation)
          dom_id = operation["domId"] || operation[:dom_id] || operation["dom_id"]
          return [dom_id, :target] if dom_id.present?

          selector = operation["selector"]
          return ["body", :targets] if selector.nil? || selector.empty?

          if single_selector?(selector)
            return [selector.from(1), :target]
          end

          [selector, :targets]
        end

        @enqueued_operations.map do |operation|
          turbo_action = translate_operation_name(operation["operation"])
          turbo_target, target_attribute = translate_selector(operation)
          turbo_template = operation["html"] || operation[:html]
          attributes = operation.except("operation", "selector", "html", "domId", "dom_id", :dom_id, :html).deep_transform_keys { |key| key.to_s.dasherize }

          turbo_stream_action_tag(turbo_action, target_attribute => turbo_target, template: turbo_template, **attributes)
        end
      else
        @enqueued_operations.map { |operation| operation.deep_transform_keys! { |key| key.to_s.camelize(:lower) } }
      end
    end

    def operations_in_custom_element
      %(<cable-ready><script type="application/json">#{operations_payload.to_json}</script></cable-ready>)
    end

    def reset!
      @enqueued_operations = []
      @previous_selector = nil
    end
  end
end
