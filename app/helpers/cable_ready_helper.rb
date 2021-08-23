# frozen_string_literal: true

module CableReadyHelper
  include CableReady::Compoundable
  include CableReady::StreamIdentifier

  def stream_from(*keys)
    keys.select!(&:itself)
    tag.stream_from(identifier: signed_stream_identifier(compound(keys)))
  end

  def broadcast_from(*keys, url: nil, &block)
    keys.select!(&:itself)
    options = {identifier: signed_stream_identifier(compound(keys))}
    options[:url] = url if url
    tag.broadcast_from(**options) { capture(&block) }
  end
end
