# frozen_string_literal: true

module CableReady
  if defined?(ActionCable)
    class Stream < ActionCable::Channel::Base
      include CableReady::StreamIdentifier

      def subscribed
        locator = verified_stream_identifier(params[:identifier])
        locator.present? ? stream_from(locator) : reject
      end
    end
  end
end
