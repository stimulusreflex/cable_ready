# frozen_string_literal: true

module CableReadyHelper
  def stream_from(*keys)
    tags = []
    keys.each do |key|
      if [String, Symbol].include? key.class
        tags << tag.div(data: {controller: "stream-from", stream_from_identifier_value: key})
      end
      if key.class < ActiveRecord::Base
        tags << tag.div(data: {controller: "stream-from", stream_from_sgid_value: key.to_sgid(expires_in: nil).to_s})
      end
    end
    tags.join("\n").html_safe
  end
end
