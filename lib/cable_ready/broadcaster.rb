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
    #       arguments: { ... }
    #     ]
    #   }
    # }
    def cable_ready_broadcast(channel: nil, payload: {})
      channel ||= [self.class.name.underscore, try(:id)].compact.join("/")
      payload ||= {}
      logger.debug "CableReady::Broadcaster#cable_ready_broadcast: to #{channel} with #{payload.inspect}"
      ActionCable.server.broadcast channel, operations.deep_stringify_keys
    end
  end
end
