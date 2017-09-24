(function () {
  "use strict";

  var CableReadyOperations = {
    // DOM Events .....................................................................................................

    dispatchEvent: function (config) {
      if (CableReady.debug) { console.log("CableReady.dispatchEvent", config); }
      var target   = document.querySelector(config.selector) || window;
      var event    = new Event(config.name);
      event.detail = config.detail;
      target.dispatchEvent(event);
    },

    // Element Mutations ..............................................................................................

    innerHtml: function (config) {
      if (CableReady.debug) { console.log("CableReady.innerHTML", config); }
      document.querySelector(config.selector).innerHTML = config.html;
      if (config.focusSelector) { document.querySelector(config.focusSelector).focus(); }
    },

    textContent: function (config) {
      if (CableReady.debug) { console.log("CableReady.textContent", config); }
      document.querySelector(config.selector).textContent = config.text;
    },

    insertAdjacentHtml: function (config) {
      if (CableReady.debug) { console.log("CableReady.insertAdjacentHTML", config); }
      document.querySelector(config.selector).insertAdjacentHTML(config.position || "beforeend", config.html);
      if (config.focusSelector) { document.querySelector(config.focusSelector).focus(); }
    },

    insertAdjacentText: function (config) {
      if (CableReady.debug) { console.log("CableReady.insertAdjacentText", config); }
      document.querySelector(config.querySelector).insertAdjacentText(config.position || "beforeend", config.text);
    },

    remove: function (config) {
      if (CableReady.debug) { console.log("CableReady.remove", config); }
      document.querySelector(config.selector).remove();
      if (config.focusSelector) { document.querySelector(config.focusSelector).focus(); }
    },

    replace: function (config) {
      if (CableReady.debug) { console.log("CableReady.replace", config); }
      var element   = document.querySelector(config.selector);
      var div       = document.createElement("div");
      div.innerHTML = config.html;
      element.parentNode.replaceChild(div.firstElementChild, element);
      if (config.focusSelector) { document.querySelector(config.focusSelector).focus(); }
    },

    setValue: function (config) {
      if (CableReady.debug) { console.log("CableReady.setValue", config); }
      document.querySelector(config.selector).value = config.value;
    },

    // Attribute Mutations ............................................................................................

    setAttribute: function (config) {
      if (CableReady.debug) { console.log("CableReady.setAttribute", config); }
      document.querySelector(config.selector).setAttribute(config.name, config.value);
    },

    removeAttribute: function (config) {
      if (CableReady.debug) { console.log("CableReady.removeAttribute", config); }
      document.querySelector(config.selector).removeAttribute(config.name);
    },

    // CSS Class Mutations ............................................................................................

    addCssClass: function (config) {
      if (CableReady.debug) { console.log("CableReady.addCssClass", config); }
      document.querySelector(config.selector).classList.add(config.name);
    },

    removeCssClass: function (config) {
      if (CableReady.debug) { console.log("CableReady.removeCssClass", config); }
      document.querySelector(config.selector).classList.remove(config.name);
    },

    // Dataset Mutations ..............................................................................................

    setDatasetProperty: function (config) {
      if (CableReady.debug) { console.log("CableReady.setDatasetProperty", config); }
      document.querySelector(config.selector).dataset[config.name] = config.value;
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
