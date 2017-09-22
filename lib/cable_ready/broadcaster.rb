module CableReady
  module Broadcaster
    extend ::ActiveSupport::Concern

    # Example Payload:
    #
    # {
    #   # DOM Events ..................................................................................................
    #
    #   dispatch_event: [{
    #     event_name: "string",
    #     element_id: "string",
    #     detail:     "object"
    #   }, ...],
    #
    #   # Element Mutations ...........................................................................................
    #
    #   inner_html: [{
    #     element_id: "string",
    #     html:       "string"
    #   }, ...],
    #
    #   text_content: [{
    #     element_id: "string",
    #     text:       "string"
    #   }, ...]
    #
    #   insert_adjacent_html: [{
    #     element_id: "string",
    #     position:   "string",
    #     html:       "string"
    #   }, ...],
    #
    #   insert_adjacent_text: [{
    #     element_id: "string",
    #     position:   "string",
    #     text:       "string"
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
    #   # Attribute Mutations .........................................................................................
    #
    #   set_attribute: [{
    #     element_id: "string",
    #     name:       "string",
    #     value:      "string"
    #   }, ...],
    #
    #   remove_attribute: [{
    #     element_id: "string",
    #     name:       "string"
    #   }, ...],
    #
    #   # CSS Class Mutations .........................................................................................
    #
    #   add_css_class: [{
    #     element_id: "string",
    #     name:       "string"
    #   }, ...],
    #
    #   remove_css_class: [{
    #     element_id: "string",
    #     name:       "string"
    #   }, ...],
    #
    #   # Dataset Mutations ...........................................................................................
    #
    #   set_dataset_property: [{
    #     element_id: "string",
    #     name:        "string",
    #     value:       "string"
    #   }, ...],
    # }
    def cable_ready_broadcast(channel, operations={})
      operations ||= {}
      operations = operations.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast channel, "cableReady" => true, "operations" => operations
    end
  end
end
