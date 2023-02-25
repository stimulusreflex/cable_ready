# frozen_string_literal: true

if defined?(ActiveJob::Base)
  class CableReady::BroadcastJob < ActiveJob::Base
    include CableReady::Broadcaster

    def perform(identifier:, operations:, model: nil)
      if model.present?
        cable_ready[identifier.safe_constantize].apply!(operations).broadcast_to(model)
      else
        cable_ready[identifier].apply!(operations).broadcast
      end
    end
  end
end
