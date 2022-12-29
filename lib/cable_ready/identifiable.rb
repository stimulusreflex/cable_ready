# frozen_string_literal: true

require "action_view"

module CableReady
  module Identifiable
    def dom_id(record, prefix = nil)
      return record.to_dom_selector if record.respond_to?(:to_dom_selector)

      prefix = prefix.to_s.strip if prefix

      id = if record.respond_to?(:to_dom_id)
        record.to_dom_id
      elsif ar_relation?(record)
        [prefix, record.model_name.plural].compact.join("_")
      elsif ar_base?(record)
        ActionView::RecordIdentifier.dom_id(record, prefix)
      else
        [prefix, record.to_s.strip].compact.join("_")
      end

      "##{id}".squeeze("#").strip.downcase
    end

    def identifiable?(obj)
      (
        obj.respond_to?(:to_dom_selector) ||
        obj.respond_to?(:to_dom_id) ||
        ar_relation?(obj) ||
        ar_base?(obj)
      )
    end

    private

    def ar_relation?(obj)
      return false if defined?(ActiveRecord).nil? || defined?(ActiveRecord::Relation).nil?

      obj.is_a?(ActiveRecord::Relation)
    end

    def ar_base?(obj)
      return false if defined?(ActiveRecord).nil? || defined?(ActiveRecord::Base).nil?

      obj.is_a?(ActiveRecord::Base)
    end
  end
end
