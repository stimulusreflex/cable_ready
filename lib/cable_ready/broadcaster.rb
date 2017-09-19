module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    # EXAMPLE_PAYLOAD = {
    #   operations: {
    #     prepend: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     append: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
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
    #     html: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     text: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     dispatch: [
    #       event_name: "string",
    #       element_id: "string",
    #       detail: { ... }
    #     ]
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
