(function () {
  self.CableReadyOperations = {
    append_child: function (config) {
      var element = document.getElementById(config.element_id);
      if (element) {
        var loader = document.createElement("div");
        loader.textContent = config.content;
        element.appendChild(loader.firstChild);
      }
    },

    remove_child: function (config) {
      var element = document.getElementById(config.element_id);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    },

    replace_child: function (config) {
      var element = document.getElementById(config.element_id);
      if (element && element.parentNode) {
        var loader = document.createElement("div");
        loader.textContent = config.content;
        element.parentNode.replaceChild(loader.firstChild, element);
      }
    },

    text_content: function (config) {
      var element = document.getElementById(config.element_id);
      if (element) {
        element.textContent = config.content;
      }
    },

    dispatch_event: function (config) {
      var event = new Event(config.event_name);
      var target;

      if (config.element_id) {
        target = document.getElementById(config.element_id);
      }

      target = target || self;
      var event = new Event(config.event_name);
      event.detail = config.arguments;
      target.dispatchEvent(event);
    },

    all: function (broadcast) {
      console.log("CableReadyOperations.all", broadcast.event_name);
      for (var operation in broadcast.operations) {
        if (broadcast.operations.hasOwnProperty(operation)) {
          var configs = broadcast.operations[operation];
          for (var i = 0; i < configs.length; i++) {
            self.CableReadyOperations[operation](configs[i]);
          }
        }
      }
    }
  };
})();
