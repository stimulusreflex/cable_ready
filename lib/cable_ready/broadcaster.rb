module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    # Example Payload:
    #
    # {
    #   dispatch_event: [{
    #     event_name: "string",
    #     element_id: "string",
    #     detail:     "object"
    #   }, ...],
    #
    #   inner_html: [{
    #     element_id: "string",
    #     html:       "string"
    #   }, ...],
    #
    #   insert_adjacent_html: [{
    #     element_id: "string",
    #     position:   "string",
    #     html:       "string"
    #   }, ...],
    #
    #   remove: [{
    #     element_id: "string"
    #   }, ...],
    #
    #   replace: [{
    #     element_id: "string",
    #     html:       "string"
    #   }, ...],
    #
    #   textContent: [{
    #     element_id: "string",
    #     text:       "string"
    #   }, ...]
    # }
    def cable_ready_broadcast(channel, payload={})
      payload ||= {}
      payload = payload.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast channel, "cableReady" => payload
    end
  end
end
