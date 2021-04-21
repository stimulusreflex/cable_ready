# frozen_string_literal: true

module CableReadyHelper
  include CableReady::Compoundable
  include CableReady::StreamIdentifier

  def stream_from(*keys)
    keys.select!(&:itself)
    tag.div(data: {
      controller: "stream-from",
      stream_from_identifier_value: signed_stream_identifier(compound(keys))
    })
  end
end
