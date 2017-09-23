(function () {
  "use strict";

  var CableReadyOperations = {
    // DOM Events .....................................................................................................

    dispatchEvent: function (config) {
      if (CableReady.debug) { console.log("CableReady.dispatchEvent", config); }
      var target   = document.getElementById(config.elementId) || window;
      var event    = new Event(config.eventName);
      event.detail = config.detail;
      target.dispatchEvent(event);
    },

    // Element Mutations ..............................................................................................

    innerHtml: function (config) {
      if (CableReady.debug) { console.log("CableReady.innerHTML", config); }
      document.getElementById(config.elementId).innerHTML = config.html;
    },

    textContent: function (config) {
      if (CableReady.debug) { console.log("CableReady.textContent", config); }
      document.getElementById(config.elementId).textContent = config.content;
    },

    insertAdjacentHtml: function (config) {
      if (CableReady.debug) { console.log("CableReady.insertAdjacentHTML", config); }
      document.getElementById(config.elementId).insertAdjacentHTML(config.position || "beforeend", config.html);
    },

    insertAdjacentText: function (config) {
      if (CableReady.debug) { console.log("CableReady.insertAdjacentText", config); }
      document.getElementById(config.elementId).insertAdjacentText(config.position || "beforeend", config.text);
    },

    remove: function (config) {
      if (CableReady.debug) { console.log("CableReady.remove", config); }
      document.getElementById(config.elementId).remove();
    },

    replace: function (config) {
      if (CableReady.debug) { console.log("CableReady.replace", config); }
      var element     = document.getElementById(config.elementId);
      var clone       = element.cloneNode(false);
      clone.innerHTML = config.html;
      element.parentNode.replaceChild(clone, element);
    },

    // Attribute Mutations ............................................................................................

    setAttribute: function (config) {
      if (CableReady.debug) { console.log("CableReady.setAttribute", config); }
      document.getElementById(config.elementId).setAttribute(config.name, config.value);
    },

    removeAttribute: function (config) {
      if (CableReady.debug) { console.log("CableReady.removeAttribute", config); }
      document.getElementById(config.elementId).removeAttribute(config.name);
    },

    // CSS Class Mutations ............................................................................................

    addCssClass: function (config) {
      if (CableReady.debug) { console.log("CableReady.addCssClass", config); }
      document.getElementById(config.elementId).classList.add(config.name);
    },

    removeCssClass: function (config) {
      if (CableReady.debug) { console.log("CableReady.removeCssClass", config); }
      document.getElementById(config.elementId).classList.remove(config.name);
    },

    // Dataset Mutations ..............................................................................................

    setDatasetProperty: function (config) {
      if (CableReady.debug) { console.log("CableReady.setDatasetProperty", config); }
      document.getElementById(config.elementId).dataset[config.name] = config.value;
    }
  };

  window.CableReady = {
    debug: false,
    perform: function (operations) {
      for (var name in operations) {
        if (operations.hasOwnProperty(name)) {
          var entries = operations[name];
          for (var i = 0; i < entries.length; i++) {
            try {
              CableReadyOperations[name](entries[i]);
            } catch (e) {
              console.log("CableReady detected an error! " + e.message);
            }
          }
        }
      }
    }
  };
})();
