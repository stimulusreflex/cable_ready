# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :name, :operations, :available_operations

    def initialize(name, available_operations)
      @name = name
      @available_operations = available_operations
      @operations = Hash.new { |hash, operation| hash[operation] = [] }
      available_operations.each do |available_operation, implementation|
        define_singleton_method available_operation, &implementation
      end
    end

    def broadcast
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast name, "cableReady" => true, "operations" => operations
      @operations = Hash.new { |hash, operation| hash[operation] = [] }
    end

    private

    def add_operation(key, options)
      operations[key] ||= []
      operations[key] << options
    end
  end
end
