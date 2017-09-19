module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    # EXAMPLE_PAYLOAD = {
    #   operations: {
    #     replace: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     remove: [
    #       {
    #         element_id: "string"
    #       }, ...
    #     ],
    #     text: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #
    #
    #     dispatch_event: [
    #       event_name: "string",
    #       element_id: "string",
    #       detail:     "object"
    #     ],
    #
    #     inner_html: [
    #       {
    #         element_id: "string",
    #         html:       "string"
    #       }, ...
    #     ],
    #
    #     insert_adjacent_html: [
    #       {
    #         element_id: "string",
    #         position:   "string",
    #         html:       "string"
    #       }, ...
    #     ],
    #   }
    # }
    def cable_ready_broadcast(channel:nil, payload:{})
      channel ||= [self.class.name.underscore, try(:id)].compact.join("/")
      payload ||= {}
      payload = payload.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast channel, "cableReady" => payload
    end
  end
end
