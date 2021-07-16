# frozen_string_literal: true

module CableReady
  module Identifiable
    def dom_id(record, prefix = nil)
      return record.to_dom_selector if record.respond_to?(:to_dom_selector)

      prefix = prefix.to_s.strip if prefix

      id = if record.respond_to?(:to_dom_id)
        record.to_dom_id
      elsif record.is_a?(ActiveRecord::Relation)
        [prefix, record.model_name.plural].compact.join("_")
      elsif record.is_a?(ActiveRecord::Base)
        ActionView::RecordIdentifier.dom_id(record, prefix)
      else
        [prefix, record.to_s.strip].compact.join("_")
      end

      "##{id}".squeeze("#").strip.downcase
    end

    def identifiable?(obj)
      obj.respond_to?(:to_dom_selector) ||
        obj.respond_to?(:to_dom_id) ||
        obj.is_a?(ActiveRecord::Relation) ||
        obj.is_a?(ActiveRecord::Base)
    end
  end
end
