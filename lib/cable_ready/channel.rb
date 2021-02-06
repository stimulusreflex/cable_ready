# frozen_string_literal: true

require_relative "identifiable"

module CableReady
  class Channel
    include CableReady::Identifiable
    attr_reader :identifier, :enqueued_operations, :previous_selector

    def initialize(identifier)
      @identifier = identifier
      reset
      CableReady.config.operation_names.each { |name| add_operation_method name }

      config_observer = self
      CableReady.config.add_observer config_observer, :add_operation_method
      ObjectSpace.define_finalizer self, -> { CableReady.config.delete_observer config_observer }
    end

    def broadcast(clear: true)
      ActionCable.server.broadcast identifier, {"cableReady" => true, "operations" => broadcastable_operations}
      reset if clear
    end

    def broadcast_to(model, clear: true)
      identifier.broadcast_to model, {"cableReady" => true, "operations" => broadcastable_operations}
      reset if clear
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
        enqueued_operations[name.to_s] << options
        self # supports operation chaining
      }
    end

    private

    def reset
      @enqueued_operations = Hash.new { |hash, key| hash[key] = [] }
      @previous_selector = nil
    end

    def broadcastable_operations
      enqueued_operations
        .select { |_, list| list.present? }
        .deep_transform_keys! { |key| key.to_s.camelize(:lower) }
    end
  end
end
