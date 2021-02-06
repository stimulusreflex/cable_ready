# frozen_string_literal: true

module CableReady
  module Identifiable
    def dom_id(record, prefix = nil, hash: "#")
      id = if record.is_a?(ActiveRecord::Relation)
        [prefix, record.model_name.plural].compact.join("_")
      elsif record.is_a?(ActiveRecord::Base)
        ActionView::RecordIdentifier.dom_id(record, prefix).to_s
      else
        [prefix, record.to_s].compact.join("_")
      end
      (hash + id).squeeze("#")
    end
  end
end
