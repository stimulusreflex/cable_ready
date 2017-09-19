(function () {
  "use strict";

  const CableReady = {};

  CableReady.operations = {

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
    },

    insertAdjacentHtml: function (config) {
      let element = document.getElementById(config.elementId);
      element.insertAdjacentHTML(config.position || "beforeend", config.html);
    },

    remove: function (config) {
      let element = document.getElementById(config.elementId);
      element.remove(element);
    },

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
