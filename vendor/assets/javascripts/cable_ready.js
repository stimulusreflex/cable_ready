(function () {
  "use strict";

  function log (operation, config) {
    if (window.CableReady.debug) {
      console.log("CableReady", operation, config);
    }
  }

  var CableReadyOperations = {
    dispatchEvent: function (config) {
      log("dispatchEvent", config);
      var event    = new Event(config.eventName);
      var target   = document.getElementById(config.elementId) || window;
      var event    = new Event(config.eventName);
      event.detail = config.detail;
      target.dispatchEvent(event);
    },

    innerHtml: function (config) {
      log("innerHTML", config);
      var element = document.getElementById(config.elementId);
      element.innerHTML = config.html;
    },

    insertAdjacentHtml: function (config) {
      log("insertAdjacentHTML", config);
      var element = document.getElementById(config.elementId);
      element.insertAdjacentHTML(config.position || "beforeend", config.html);
    },

    remove: function (config) {
      log("remove", config);
      var element = document.getElementById(config.elementId);
      element.remove(element);
    },

    replace: function (config) {
      log("replace", config);
      var element     = document.getElementById(config.elementId);
      var clone       = element.cloneNode(false);
      clone.innerHTML = config.html;
      element.parentNode.replaceChild(clone, element);
    },

    textContent: function (config) {
      log("textContent", config);
      var element = document.getElementById(config.elementId);
      element.textContent = config.content;
    }
  };

  window.CableReady = {
    debug: false,
    perform: function (operations) {
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
