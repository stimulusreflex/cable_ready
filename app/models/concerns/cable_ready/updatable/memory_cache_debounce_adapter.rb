# frozen_string_literal: true

module CableReady
  module Updatable
    class MemoryCacheDebounceAdapter
      include Singleton

      delegate_missing_to :@store

      def initialize
        super
        @store = ActiveSupport::Cache::MemoryStore.new(expires_in: 5.minutes, size: 8.megabytes)
      end

      def []=(key, value)
        @store.write(key, value)
      end

      def [](key)
        @store.read(key)
      end
    end
  end
end
