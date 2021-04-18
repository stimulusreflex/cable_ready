# frozen_string_literal: true

module CableReady
  class Stream < ActionCable::Channel::Base
    def subscribed
      locator = params[:identifier]
      locator.present? ? stream_from(locator) : reject
    end
  end
end
