# frozen_string_literal: true

class CableReadyBroadcastJob < (defined?(ActiveJob::Base) ? ActiveJob::Base : Object)
  include CableReady::Broadcaster
  queue_as :default if defined?(ActiveJob::Base)

  def perform(identifier:, operations:, model: nil)
    if model.present?
      cable_ready[identifier.safe_constantize].apply!(operations).broadcast_to(model)
    else
      cable_ready[identifier].apply!(operations).broadcast
    end
  end
end
