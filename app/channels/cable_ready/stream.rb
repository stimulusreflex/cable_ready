# frozen_string_literal: true

module CableReady
  class Stream < ActionCable::Channel::Base
    def subscribed
      if params[:sgid].present?
        locator = GlobalID::Locator.locate_signed(params[:sgid])
        locator ? stream_for(locator) : reject
      else
        locator = params[:identifier]
        locator.present? ? stream_from(locator) : reject
      end
    end
  end
end
