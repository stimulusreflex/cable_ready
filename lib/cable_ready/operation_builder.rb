# frozen_string_literal: true

require "active_record"

require_relative "identifiable"

module CableReady
  class OperationBuilder
    include Identifiable
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
        selector, options = nil, args.first || {} # 1 or 0 params
        selector, options = options, {} unless options.is_a?(Hash) # swap if only selector provided
        selector, options = args[0, 2] if args.many? # 2 or more params
        options.stringify_keys!
        options["selector"] = selector if selector && options.exclude?("selector")
        options["selector"] = previous_selector if previous_selector && options.exclude?("selector")
        if options.include?("selector")
          @previous_selector = options["selector"]
          options["selector"] = previous_selector.is_a?(ActiveRecord::Base) || previous_selector.is_a?(ActiveRecord::Relation) ? dom_id(previous_selector) : previous_selector
        end
        @enqueued_operations[name.to_s] << options
        self
      }
    end

    def to_json(*args)
      @enqueued_operations.to_json(*args)
    end

    def apply!(operations = "{}")
      operations = begin
        JSON.parse(operations.is_a?(String) ? operations : operations.to_json)
      rescue JSON::ParserError
        {}
      end
      operations.each do |name, operation|
        operation.each do |enqueued_operation|
          @enqueued_operations[name.to_s] << enqueued_operation
        end
      end
      self
    end

    def operations_payload
      @enqueued_operations.select { |_, list| list.present? }.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end

    def reset!
      @enqueued_operations = Hash.new { |hash, key| hash[key] = [] }
      @previous_selector = nil
    end
  end
end
