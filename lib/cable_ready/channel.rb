# frozen_string_literal: true

module CableReady
  class Channel
    attr_reader :name, :operations, :tools

    def initialize(name, tools)
      @name = name
      @tools = tools
      @operations = stub
      
      tools.each do |tool|
        define_singleton_method tool do |options = {}|
          add_operation tool, options
        end
      end
    end
    
    def broadcast
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast name, "cableReady" => true, "operations" => operations
      @operations = stub
    end

    private

    def add_operation(key, options)
      operations[key] ||= []
      operations[key] << options
    end

    def stub
      tools.inject({}) do |hash, tool|
        hash[tool] = []
        hash
      end
    end
  end
end
