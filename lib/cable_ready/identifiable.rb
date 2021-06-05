# frozen_string_literal: true

module CableReady
  module Identifiable
    def dom_id(record, prefix = nil)
      prefix = prefix.to_s.strip if prefix

      id = if record.is_a?(ActiveRecord::Relation)
        [prefix, record.model_name.plural].compact.join("_")
      elsif record.is_a?(ActiveRecord::Base)
        ActionView::RecordIdentifier.dom_id(record, prefix)
      else
        [prefix, record.to_s.strip].compact.join("_")
      end

      "##{id}".squeeze("#").strip
    end

    def determine_dom_selector(obj)
      if obj.respond_to?(:to_dom_selector)
        obj.to_dom_selector
      elsif obj.is_a?(ActiveRecord::Base) || obj.is_a?(ActiveRecord::Relation)
        dom_id(obj)
      else
        obj.to_s
      end
    end
  end
end
