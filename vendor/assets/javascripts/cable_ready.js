(function () {
  "use strict";

  const operations = {
    prepend: function (config) {
      let element = document.getElementById(config.element_id);
      if (element) {
        element.insertAdjacentHTML("afterbegin", config.content);
      }
    },

    append: function (config) {
      let element = document.getElementById(config.element_id);
      if (element) {
        element.insertAdjacentHTML("beforeend", config.content);
      }
    },

    remove: function (config) {
      let element = document.getElementById(config.element_id);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    },

    replace: function (config) {
      let element = document.getElementById(config.element_id);
      if (element && element.parentNode) {
        let loader = document.createElement("div");
        loader.innerHTML = config.content;
        element.parentNode.replaceChild(loader.firstChild, element);
      }
    },

    html: function (config) {
      let element = document.getElementById(config.element_id);
      if (element) {
        element.innerHTML = config.content;
      }
    },

    text: function (config) {
      let element = document.getElementById(config.element_id);
      if (element) {
        element.textContent = config.content;
      }
    },

    dispatch: function (config) {
      let event = new Event(config.event_name);
      let target;

      if (config.element_id) {
        target = document.getElementById(config.element_id);
      }

      target = target || window;
      let event = new Event(config.event_name);
      event.detail = config.arguments;
      target.dispatchEvent(event);
    }
  };

  window.CableReady = {};
  window.CableReady.run = function (payload) {
    for (let operation in payload) {
      if (payload.hasOwnProperty(operation)) {
        let configs = payload[operation];
        for (let i = 0; i < configs.length; i++) {
          window.CableReady.behaviors[operation](configs[i]);
        }
      }
    }
  };

})();
