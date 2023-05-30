# frozen_string_literal: true

module CableReady
  class OperationBuilder
    include Identifiable
    attr_reader :identifier, :previous_selector, :previous_xpath

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
        if previous_selector && options.exclude?("selector")
          options["selector"] = previous_selector
          options["xpath"] = previous_xpath if previous_xpath
        end
        if options.include?("selector")
          @previous_selector = options["selector"]
          @previous_xpath = options["xpath"]
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
      @enqueued_operations.map { |operation| operation.deep_transform_keys! { |key| key.to_s.camelize(:lower) } }
    end

    def reset!
      @enqueued_operations = []
      @previous_selector = nil
    end
  end
end
