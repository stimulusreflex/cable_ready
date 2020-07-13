# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :identifier, :operations, :available_operations

    def initialize(identifier, available_operations)
      @identifier = identifier
      @available_operations = available_operations
      reset
      available_operations.each do |available_operation, implementation|
        define_singleton_method available_operation, &implementation
      end
    end

    def broadcast(clear)
      operations.select! { |_, list| list.present? }
      handle_operations_keys! operations
      ActionCable.server.broadcast identifier, "cableReady" => true, "operations" => operations
      reset if clear
    end

    def broadcast_to(model, clear)
      operations.select! { |_, list| list.present? }
      handle_operations_keys! operations
      identifier.broadcast_to model, "cableReady" => true, "operations" => operations
      reset if clear
    end

    private

    def add_operation(key, options)
      operations[key] << options
    end

    def reset
      @operations = Hash.new { |hash, operation| hash[operation] = [] }
    end

    def handle_operations_keys!(operations)
      dispatch_operations = operations.extract! :dispatch_event
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }

      if dispatch_operations.key? :dispatch_event
        dispatch_operations[:dispatch_event].each do |event|
          event[:detail]&.deep_transform_keys! { |key| case_for_detail(key) } # CableReady.config
          event.transform_keys! { |key| key.to_s.camelize(:lower) }
        end
        dispatch_operations.transform_keys! { |key| key.to_s.camelize(:lower) }
        operations.merge! dispatch_operations
      end
    end

    def case_for_detail(key)
      case config.detail_case
      when "snake"
        key.to_s.underscore
      when "pascal"
        key.to_s.camelize
      when "kebab"
        key.to_s.dasherize
      when "camel"
        key.to_s.camelize(:lower)
      when "keep" # keeps original
        key.to_s
      else
        key.to_s.camelize(:lower)
      end
    end

    def config
      CableReady.config
    end
  end
end
