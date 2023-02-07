# frozen_string_literal: true

require "active_support/concern"

module ExtendHasMany
  extend ::ActiveSupport::Concern

  class_methods do
    def has_many(*args, &block)
      options = args.extract_options!
      options[:extend] = Array(options[:extend]).push(ClassMethods)
      super(*args, **options, &block)
    end
  end
end
