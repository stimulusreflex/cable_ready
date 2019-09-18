import morphdom from "morphdom";

const dispatch = (name, detail = {}) => {
  DOMOperations.dispatchEvent({ name, detail });
};

const xpathToElement = xpath => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
};

const getRootElement = config => {
  return config.xpath
    ? xpathToElement(config.selector)
    : document.querySelector(config.selector);
};

const DOMOperations = {
  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    let target = document;
    if (config.selector) {
      target = document.querySelector(config.selector) || document;
    }
    const event = new Event(config.name);
    event.detail = config.detail;
    target.dispatchEvent(event);
  },

  // Element Mutations .......................................................................................

  morph: config => {
    let template = document.createElement("template");
    template.innerHTML = String(config.html).trim();
    dispatch("cable-ready:before-morph", { config, content: template.content });
    morphdom(config.rootElement, template.content, {
      childrenOnly: !!config.childrenOnly
    });
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch("cable-ready:after-morph", { config, content: template.content });
  },

  innerHtml: config => {
    dispatch("cable-ready:before-inner-html", config);
    config.rootElement.innerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch("cable-ready:after-inner-html", config);
  },

  outerHtml: config => {
    dispatch("cable-ready:before-outer-html", config);
    config.rootElement.outerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch("cable-ready:after-outer-html", config);
  },

  textContent: config => {
    dispatch("cable-ready:before-text-content", config);
    config.rootElement.textContent = config.text;
    dispatch("cable-ready:after-text-content", config);
  },

  insertAdjacentHtml: config => {
    dispatch("cable-ready:before-insert-adjacent-html", config);
    config.rootElement.insertAdjacentHTML(
      config.position || "beforeend",
      config.html
    );
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch("cable-ready:after-insert-adjacent-html", config);
  },

  insertAdjacentText: config => {
    dispatch("cable-ready:before-insert-adjacent-text", config);
    config.rootElement.insertAdjacentText(
      config.position || "beforeend",
      config.text
    );
    dispatch("cable-ready:after-insert-adjacent-text", config);
  },

  remove: config => {
    dispatch("cable-ready:before-remove", config);
    config.rootElement.remove();
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch("cable-ready:after-remove", config);
  },

  setValue: config => {
    dispatch("cable-ready:before-set-value", config);
    config.rootElement.value = config.value;
    dispatch("cable-ready:after-set-value", config);
  },

  // Attribute Mutations .....................................................................................

  setAttribute: config => {
    dispatch("cable-ready:before-set-attribute", config);
    config.rootElement.setAttribute(config.name, config.value);
    dispatch("cable-ready:after-set-attribute", config);
  },

  removeAttribute: config => {
    dispatch("cable-ready:before-remove-attribute", config);
    config.rootElement.removeAttribute(config.name);
    dispatch("cable-ready:after-remove-attribute", config);
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: config => {
    dispatch("cable-ready:before-add-css-class", config);
    config.rootElement.classList.add(config.name);
    dispatch("cable-ready:after-add-css-class", config);
  },

  removeCssClass: config => {
    dispatch("cable-ready:before-remove-css-class", config);
    config.rootElement.classList.remove(config.name);
    dispatch("cable-ready:after-remove-css-class", config);
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: config => {
    dispatch("cable-ready:before-set-dataset-property", config);
    config.rootElement.dataset[config.name] = config.value;
    dispatch("cable-ready:after-set-dataset-property", config);
  }
};

const perform = operations => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name];
      for (let i = 0; i < entries.length; i++) {
        try {
          const config = entries[i];
          config.rootElement = getRootElement(config);
          DOMOperations[name](config);
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`);
        }
      }
    }
  }
};

export default { perform };
