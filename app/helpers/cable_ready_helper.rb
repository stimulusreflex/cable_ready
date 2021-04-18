# frozen_string_literal: true

module CableReadyHelper
  include CableReady::Compoundable

  def stream_from(*keys)
    keys.select!(&:itself)
    tag.div(data: {controller: "stream-from", stream_from_identifier_value: compound(keys)})
  end
end
