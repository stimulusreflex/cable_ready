# frozen_string_literal: true

class CableReadyBroadcastJob < ActiveJob::Base
  include CableReady::Broadcaster
  queue_as :default

  def perform(identifier:, operations:, model: nil)
    if model.present?
      cable_ready[identifier.safe_constantize].apply!(operations).broadcast_to(model)
    else
      cable_ready[identifier].apply!(operations).broadcast
    end
  end
end
