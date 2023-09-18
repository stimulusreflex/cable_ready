# frozen_string_literal: true

module CableReady
  module ViewHelper
    include CableReady::Compoundable
    include CableReady::StreamIdentifier

    def stream_from(...)
      warn "DEPRECATED: please use `cable_ready_stream_from` instead. The `stream_from` view helper will be removed from a future version of CableReady 5"

      cable_ready_stream_from(...)
    end

    def updates_for(...)
      warn "DEPRECATED: please use `cable_ready_updates_for` instead. The `updates_for` view helper will be removed from a future version of CableReady 5"

      cable_ready_updates_for(...)
    end

    def updates_for_if(...)
      warn "DEPRECATED: please use `cable_ready_updates_for_if` instead. The `updates_for_if` view helper will be removed from a future version of CableReady 5"

      cable_ready_updates_for_if(...)
    end

    def cable_ready_stream_from(*keys, html_options: {})
      tag.cable_ready_stream_from(**build_options(*keys, html_options))
    end

    def cable_ready_updates_for(*keys, url: nil, debounce: nil, only: nil, ignore_inner_updates: false, observe_appearance: false, html_options: {}, &block)
      options = build_options(*keys, html_options)
      options[:url] = url if url
      options[:debounce] = debounce if debounce
      options[:only] = only if only
      options[:"ignore-inner-updates"] = "" if ignore_inner_updates
      options[:"observe-appearance"] = "" if observe_appearance
      tag.cable_ready_updates_for(**options) { capture(&block) }
    end

    def cable_ready_updates_for_if(condition, *keys, **options, &block)
      if condition
        cable_ready_updates_for(*keys, **options, &block)
      else
        capture(&block)
      end
    end

    def cable_car
      CableReady::CableCar.instance
    end

    private

    def build_options(*keys, html_options)
      keys.select!(&:itself)
      {identifier: signed_stream_identifier(compound(keys))}.merge(html_options)
    end
  end
end
