# frozen_string_literal: true

module CableReadyHelper
  include CableReady::Compoundable
  include CableReady::StreamIdentifier

  def stream_from(*keys, html_options: {})
    tag.stream_from(**build_options(*keys, html_options))
  end

  def broadcast_from(*keys, url: nil, html_options: {}, &block)
    options = build_options(*keys, html_options)
    options[:url] = url if url
    tag.broadcast_from(**options) { capture(&block) }
  end

  private

  def build_options(*keys, html_options)
    keys.select!(&:itself)
    {identifier: signed_stream_identifier(compound(keys))}.merge(html_options)
  end
end
