(function () {
  "use strict";

  const CableReady = {};

  CableReady.operations = {
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

    text: function (config) {
      let element = document.getElementById(config.element_id);
      if (element) {
        element.textContent = config.content;
      }
    },





    dispatchEvent: function (config) {
      let event    = new Event(config.eventName);
      let target   = document.getElementById(config.elementId) || window;
      let event    = new Event(config.eventName);
      event.detail = config.detail;
      target.dispatchEvent(event);
    },

    innerHtml: function (config) {
      let element = document.getElementById(config.elementId);
      element.innerHTML = config.html;
    }
  };



  CableReady.receive = function (operations) {
    for (let name in operations) {
      if (operations.hasOwnProperty(name)) {
        let entries = operations[name];
        for (let i = 0; i < entries.length; i++) {
          window.CableReady.operations[name](entries[i]);
        }
      }
    }
  };

})();
