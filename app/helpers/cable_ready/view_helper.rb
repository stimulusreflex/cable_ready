# frozen_string_literal: true

module CableReady
  module ViewHelper
    include CableReady::Compoundable
    include CableReady::StreamIdentifier
    include CableReady::Broadcaster

    def stream_from(*keys, html_options: {})
      tag.stream_from(**build_options(*keys, html_options))
    end

    def updates_for(*keys, url: nil, debounce: nil, only: nil, ignore_inner_updates: false, html_options: {}, &block)
      options = build_options(*keys, html_options)
      options[:url] = url if url
      options[:debounce] = debounce if debounce
      options[:only] = only if only
      options[:"ignore-inner-updates"] = "" if ignore_inner_updates
      tag.updates_for(**options) { capture(&block) }
    end

    def updates_for_if(condition, *keys, **options, &block)
      if condition
        updates_for(*keys, **options, &block)
      else
        capture(&block)
      end
    end

    private

    def build_options(*keys, html_options)
      keys.select!(&:itself)
      {identifier: signed_stream_identifier(compound(keys))}.merge(html_options)
    end
  end
end
