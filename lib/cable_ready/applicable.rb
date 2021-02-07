# frozen_string_literal: true

module CableReady
  module Applicable
    def to_json
      enqueued_operations.to_json
    end

    def apply(operations = "{}")
      operations = begin
        JSON.parse(operations.is_a?(String) ? operations : operations.to_json)
      rescue JSON::ParserError
        {}
      end
      operations.each do |operation_method|
        key, operation = operation_method
        operation.each do |enqueued_operation|
          enqueued_operations[key] << enqueued_operation
        end
      end
      self
    end
  end
end