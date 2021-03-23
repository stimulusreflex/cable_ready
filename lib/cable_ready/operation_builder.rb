module CableReady
  class OperationBuilder
    attr_reader :identifier

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

      singleton_class.public_send :define_method, name, ->(options = {}) {
        @enqueued_operations[name.to_s] << options.stringify_keys
        self
      }
    end

    def to_json(*args)
      @enqueued_operations.to_json(*args)
    end

    def apply(operations = "{}")
      operations = begin
        JSON.parse(operations.is_a?(String) ? operations : operations.to_json)
      rescue JSON::ParserError
        {}
      end
      operations.each do |key, operation|
        operation.each do |enqueued_operation|
          @enqueued_operations[key.to_s] << enqueued_operation
        end
      end
      self
    end

    def operations_payload
      @enqueued_operations.select { |_, list| list.present? }.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end

    def reset!
      @enqueued_operations = Hash.new { |hash, key| hash[key] = [] }
    end
  end
end
