# frozen_string_literal: true

module CableReadyHelper
  def stream_from(key)
    if key.is_a? String
      tag.div data: {controller: "stream-from", stream_from_identifier_value: key}
    else
      tag.div data: {controller: "stream-from", stream_from_sgid_value: key.to_sgid(expires_in: nil).to_s}
    end
  end
end
