module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    OPERATIONS = %w(
      append_child
      dispatch_event
      remove_child
      replace_child
      text_content
    )

    # EXAMPLE_PAYLOAD = {
    #   event_name: "merged into the payload",
    #   operations: {
    #     append_child: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     replace_child: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     remove_child: [
    #       {
    #         element_id: "string"
    #       }, ...
    #     ],
    #     text_content: [
    #       {
    #         element_id: "string",
    #         content: "string"
    #       }, ...
    #     ],
    #     dispatch_event: [
    #       event_name: "string",
    #       element_id: "string",
    #       arguments: { ... }
    #     ]
    #   }
    # }
    def broadcast(event_name, channel: nil, operations: {})
      channel    ||= [self.class.name.underscore, try(:id)].compact.join("/")
      operations ||= {}
      payload = {
        event_name: event_name.to_s,
        operations: operations
      }
      payload.deep_transform_keys!(&:to_s)

      # TODO: validate payload ?

      logger.debug "ActionCable Broadcast: #{event_name} to #{channel} with #{payload.inspect}"
      ::ActionCable.server.broadcast channel, payload
    end
  end
end
