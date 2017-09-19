(function () {
  "use strict";

  var CableReadyOperations = {
    dispatchEvent: function (config) {
      var event    = new Event(config.eventName);
      var target   = document.getElementById(config.elementId) || window;
      var event    = new Event(config.eventName);
      event.detail = config.detail;
      target.dispatchEvent(event);
    },

    innerHtml: function (config) {
      var element = document.getElementById(config.elementId);
      element.innerHTML = config.html;
    },

    insertAdjacentHtml: function (config) {
      var element = document.getElementById(config.elementId);
      element.insertAdjacentHTML(config.position || "beforeend", config.html);
    },

    remove: function (config) {
      var element = document.getElementById(config.elementId);
      element.remove(element);
    },

    replace: function (config) {
      var element     = document.getElementById(config.elementId);
      var clone       = element.cloneNode(false);
      clone.innerHTML = config.html;
      element.parentNode.replaceChild(clone, element);
    },

    textContent: function (config) {
      var element = document.getElementById(config.elementId);
      element.textContent = config.content;
    }
  };

  window.CableReady = {
    receive: function (operations) {
      for (var name in operations) {
        if (operations.hasOwnProperty(name)) {
          var entries = operations[name];
          for (var i = 0; i < entries.length; i++) {
            CableReadyOperations[name](entries[i]);
          }
        }
      }
    }
  };
})();
