module CableReady
  class Channel
    attr_reader :name, :operations

    # Example Operations Payload:
    #
    # {
    #   # DOM Events ..................................................................................................
    #
    #   dispatch_event: [{
    #     name:     "string",
    #     detail:   "object",
    #     selector: "string",
    #   }, ...],
    #
    #   # Element Mutations ...........................................................................................
    #
    #   morph: [{
    #     selector:      "string",
    #     html:          "string"
    #     children_only:  true|false,
    #     focus_selector: "string",
    #   }, ...],
    #
    #   inner_html: [{
    #     selector:      "string",
    #     focus_selector: "string",
    #     html:          "string"
    #   }, ...],
    #
    #   text_content: [{
    #     selector: "string",
    #     text:     "string"
    #   }, ...]
    #
    #   insert_adjacent_html: [{
    #     selector:      "string",
    #     focus_selector: "string",
    #     position:      "string",
    #     html:          "string"
    #   }, ...],
    #
    #   insert_adjacent_text: [{
    #     selector: "string",
    #     position: "string",
    #     text:     "string"
    #   }, ...],
    #
    #   remove: [{
    #     selector:      "string",
    #     focus_selector: "string,
    #   }, ...],
    #
    #   replace: [{
    #     selector:      "string",
    #     focus_selector: "string",
    #     html:          "string"
    #   }, ...],
    #
    #   set_value: [{
    #     selector: "string",
    #     value:    "string"
    #   }, ...],
    #
    #   # Attribute Mutations .........................................................................................
    #
    #   set_attribute: [{
    #     selector: "string",
    #     name:     "string",
    #     value:    "string"
    #   }, ...],
    #
    #   remove_attribute: [{
    #     selector: "string",
    #     name:     "string"
    #   }, ...],
    #
    #   # CSS Class Mutations .........................................................................................
    #
    #   add_css_class: [{
    #     selector: "string",
    #     name:     "string"
    #   }, ...],
    #
    #   remove_css_class: [{
    #     selector: "string",
    #     name:     "string"
    #   }, ...],
    #
    #   # Dataset Mutations ...........................................................................................
    #
    #   set_dataset_property: [{
    #     selector: "string",
    #     name:     "string",
    #     value:    "string"
    #   }, ...],
    # }
    def initialize(name)
      @name = name
      @operations = stub
    end

    def clear
      @operations = stub
    end

    def broadcast
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast name, "cableReady" => true, "operations" => operations
      clear
    end

    def dispatch_event(options={})
      operations[:dispatch_event] << options
    end

    def morph(options={})
      operations[:morph] << options
    end

    def inner_html(options={})
      operations[:inner_html] << options
    end

    def text_content(options={})
      operations[:text_content] << options
    end

    def insert_adjacent_html(options={})
      operations[:insert_adjacent_html] << options
    end

    def insert_adjacent_text(options={})
      operations[:insert_adjacent_text] << options
    end

    def remove(options={})
      operations[:remove] << options
    end

    def replace(options={})
      operations[:replace] << options
    end

    def set_value(options={})
      operations[:set_value] << options
    end

    def set_attribute(options={})
      operations[:set_attribute] << options
    end

    def remove_attribute(options={})
      operations[:remove_attribute] << options
    end

    def add_css_class(options={})
      operations[:add_css_class] << options
    end

    def remove_css_class(options={})
      operations[:remove_css_class] << options
    end

    def set_dataset_property(options={})
      operations[:set_dataset_property] << options
    end

    private

      def stub
        {
          dispatch_event: [],
          morph: [],
          inner_html: [],
          text_content: [],
          insert_adjacent_html: [],
          insert_adjacent_text: [],
          remove: [],
          replace: [],
          set_value: [],
          set_attribute: [],
          remove_attribute: [],
          add_css_class: [],
          remove_css_class: [],
          set_dataset_property: []
        }
      end
  end
end
