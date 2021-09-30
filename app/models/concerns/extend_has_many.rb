# frozen_string_literal: true

module ExtendHasMany
  extend ::ActiveSupport::Concern

  class_methods do
    def has_many(*args, &block)
      options = args.extract_options!
      options[:extend] = Array(options[:extend]).push(ClassMethods)
      super(*args, **options, &block)
    end

    def debouncer
      @debouncer ||= Debouncer.new(0.02) { |identifier| ActionCable.server.broadcast(identifier, {}) }
    end
  end
end
