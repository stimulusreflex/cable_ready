# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :identifier, :operations, :available_operations

    def initialize(identifier, available_operations)
      @identifier = identifier
      @available_operations = available_operations
      @operations = Hash.new { |hash, operation| hash[operation] = [] }
      available_operations.each do |available_operation, implementation|
        define_singleton_method available_operation, &implementation
      end
    end

    def broadcast(clear)
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast identifier, "cableReady" => true, "operations" => operations
      @operations = Hash.new { |hash, operation| hash[operation] = [] } if clear
    end

    def broadcast_to(model, clear)
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      identifier.broadcast_to model, "cableReady" => true, "operations" => operations
      @operations = Hash.new { |hash, operation| hash[operation] = [] } if clear
    end

    private

    def add_operation(key, options)
      operations[key] << options
    end
  end
end
