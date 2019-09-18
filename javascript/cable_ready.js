import morphdom from 'morphdom';

const dispatch = (name, detail = {}) => {
  DOMOperations.dispatchEvent({ name, detail });
};

const DOMOperations = {
  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    let target = document;
    if (config.selector) target = document.querySelector(config.selector) || document;
    const event = new Event(config.name);
    event.detail = config.detail;
    target.dispatchEvent(event);
  },

  // Element Mutations .......................................................................................

  morph: config => {
    let template = document.createElement('template');
    template.innerHTML = String(config.html).trim();
    dispatch('cable-ready:before-morph', { config, content: template.content });
    morphdom(document.querySelector(config.selector), template.content, {
      childrenOnly: !!config.childrenOnly,
    });
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch('cable-ready:after-morph', { config, content: template.content });
  },

  innerHtml: config => {
    dispatch('cable-ready:before-inner-html', config);
    document.querySelector(config.selector).innerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch('cable-ready:after-inner-html', config);
  },

  outerHtml: config => {
    dispatch('cable-ready:before-outer-html', config);
    const element = document.querySelector(config.selector);
    element.outerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch('cable-ready:after-outer-html', config);
  },

  textContent: config => {
    dispatch('cable-ready:before-text-content', config);
    document.querySelector(config.selector).textContent = config.text;
    dispatch('cable-ready:after-text-content', config);
  },

  insertAdjacentHtml: config => {
    dispatch('cable-ready:before-insert-adjacent-html', config);
    document.querySelector(config.selector).insertAdjacentHTML(config.position || 'beforeend', config.html);
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch('cable-ready:after-insert-adjacent-html', config);
  },

  insertAdjacentText: config => {
    dispatch('cable-ready:before-insert-adjacent-text', config);
    document
      .querySelector(config.querySelector)
      .insertAdjacentText(config.position || 'beforeend', config.text);
    dispatch('cable-ready:after-insert-adjacent-text', config);
  },

  remove: config => {
    dispatch('cable-ready:before-remove', config);
    document.querySelector(config.selector).remove();
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
    dispatch('cable-ready:after-remove', config);
  },

  setValue: config => {
    dispatch('cable-ready:before-set-value', config);
    document.querySelector(config.selector).value = config.value;
    dispatch('cable-ready:after-set-value', config);
  },

  // Attribute Mutations .....................................................................................

  setAttribute: config => {
    dispatch('cable-ready:before-set-attribute', config);
    document.querySelector(config.selector).setAttribute(config.name, config.value);
    dispatch('cable-ready:after-set-attribute', config);
  },

  removeAttribute: config => {
    dispatch('cable-ready:before-remove-attribute', config);
    document.querySelector(config.selector).removeAttribute(config.name);
    dispatch('cable-ready:after-remove-attribute', config);
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: config => {
    dispatch('cable-ready:before-add-css-class', config);
    document.querySelector(config.selector).classList.add(config.name);
    dispatch('cable-ready:after-add-css-class', config);
  },

  removeCssClass: config => {
    dispatch('cable-ready:before-remove-css-class', config);
    document.querySelector(config.selector).classList.remove(config.name);
    dispatch('cable-ready:after-remove-css-class', config);
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: config => {
    dispatch('cable-ready:before-set-dataset-property', config);
    document.querySelector(config.selector).dataset[config.name] = config.value;
    dispatch('cable-ready:after-set-dataset-property', config);
  },
};

const perform = operations => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name];
      for (let i = 0; i < entries.length; i++) {
        try {
          const config = entries[i];
          DOMOperations[name](config);
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`);
        }
      }
    }
  }
};

export default { perform };
