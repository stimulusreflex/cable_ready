module CableReady
  class Channel
    attr_reader :name, :operations, :options

    # Example Operations Payload:
    #
    # {
    #   # Cookies .....................................................................................................
    #
    #   set_cookie: [
    #     {cookie: "example=value; path=/; expires=Sat, 07 Mar 2020 16:19:19 GMT"},
    #     ...
    #   ]
    #
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
    #     permanent_attribute_name: "string",
    #     focus_selector: "string",
    #   }, ...],
    #
    #   inner_html: [{
    #     selector:      "string",
    #     focus_selector: "string",
    #     html:          "string"
    #   }, ...],
    #
    #   outer_html: [{
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
    #   # Style Mutations ...........................................................................................
    #
    #   set_style: [{
    #     selector: "string",
    #     name:     "string",
    #     value:    "string"
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
    def initialize(name, options = {})
      @name = name
      @operations = stub
      @options = options
    end

    def clear
      @operations = stub
    end

    def broadcast
      operations.select! { |_, list| list.present? }
      operations.deep_transform_keys! { |key| key.to_s.camelize(:lower) }
      ActionCable.server.broadcast name, "cableReady" => true, "operations" => operations, "options" => options
      clear
    end

    def set_cookie(value)
      add_operation(:set_cookie, {cookie: value})
    end

    def dispatch_event(options = {})
      add_operation(:dispatch_event, options)
    end

    def morph(options = {})
      add_operation(:morph, options)
    end

    def inner_html(options = {})
      add_operation(:inner_html, options)
    end

    def outer_html(options = {})
      add_operation(:outer_html, options)
    end

    def text_content(options = {})
      add_operation(:text_content, options)
    end

    def insert_adjacent_html(options = {})
      add_operation(:insert_adjacent_html, options)
    end

    def insert_adjacent_text(options = {})
      add_operation(:insert_adjacent_text, options)
    end

    def remove(options = {})
      add_operation(:remove, options)
    end

    def set_value(options = {})
      add_operation(:set_value, options)
    end

    def set_attribute(options = {})
      add_operation(:set_attribute, options)
    end

    def remove_attribute(options = {})
      add_operation(:remove_attribute, options)
    end

    def add_css_class(options = {})
      add_operation(:add_css_class, options)
    end

    def remove_css_class(options = {})
      add_operation(:remove_css_class, options)
    end

    def set_style(options = {})
      add_operation(:set_style, options)
    end

    def set_dataset_property(options = {})
      add_operation(:set_dataset_property, options)
    end

    private

    def add_operation(key, options)
      operations[key] ||= []
      operations[key] << options
    end

    def stub
      {
        add_css_class: [],
        dispatch_event: [],
        inner_html: [],
        insert_adjacent_html: [],
        insert_adjacent_text: [],
        morph: [],
        outer_html: [],
        remove: [],
        remove_attribute: [],
        remove_css_class: [],
        set_attribute: [],
        set_cookie: [],
        set_dataset_property: [],
        set_style: [],
        set_value: [],
        text_content: []
      }
    end
  end
end
