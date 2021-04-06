# frozen_string_literal: true

require "active_record"
require "action_view"

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
  end
end
