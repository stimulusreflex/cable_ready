import morphdom from 'morphdom';

const xpathToElement = xpath => {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

const DOMOperations = {
  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    const { element, name, detail } = config;
    element.dispatchEvent(new CustomEvent(name, { detail }));
  },

  // Element Mutations .......................................................................................

  morph: detail => {
    const { element, html, childrenOnly, focusSelector } = detail;
    const template = document.createElement('template');
    template.innerHTML = String(html).trim();
    detail = { ...detail, content: template.content };
    element.dispatchEvent(new CustomEvent('cable-ready:before-morph', { detail }));
    morphdom(element, template.content, { childrenOnly: !!childrenOnly });
    if (focusSelector) document.querySelector(focusSelector).focus();
    element.dispatchEvent(new CustomEvent('cable-ready:after-morph', { detail }));
  },

  innerHtml: detail => {
    const { element, html, focusSelector } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-inner-html', { detail }));
    element.innerHTML = html;
    if (focusSelector) document.querySelector(focusSelector).focus();
    element.dispatchEvent(new CustomEvent('cable-ready:after-inner-html', { detail }));
  },

  outerHtml: detail => {
    const { element, html, focusSelector } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-outer-html', { detail }));
    element.outerHTML = html;
    if (focusSelector) document.querySelector(focusSelector).focus();
    element.dispatchEvent(new CustomEvent('cable-ready:after-outer-html', { detail }));
  },

  textContent: detail => {
    const { element, text } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-text-content', { detail }));
    element.textContent = text;
    element.dispatchEvent(new CustomEvent('cable-ready:after-text-content', { detail }));
  },

  insertAdjacentHtml: detail => {
    const { element, html, position, focusSelector } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-insert-adjacent-html', { detail }));
    element.insertAdjacentHTML(position || 'beforeend', html);
    if (focusSelector) document.querySelector(focusSelector).focus();
    element.dispatchEvent(new CustomEvent('cable-ready:after-insert-adjacent-html', { detail }));
  },

  insertAdjacentText: detail => {
    const { element, text, position } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-insert-adjacent-text', { detail }));
    element.insertAdjacentText(position || 'beforeend', text);
    element.dispatchEvent(new CustomEvent('cable-ready:after-insert-adjacent-text', { detail }));
  },

  remove: detail => {
    const { element, focusSelector } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-remove', { detail }));
    element.remove();
    if (focusSelector) document.querySelector(focusSelector).focus();
    element.dispatchEvent(new CustomEvent('cable-ready:after-remove', { detail }));
  },

  setValue: detail => {
    const { element, value } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-set-value', { detail }));
    element.value = value;
    element.dispatchEvent(new CustomEvent('cable-ready:after-set-value', { detail }));
  },

  // Attribute Mutations .....................................................................................

  setAttribute: detail => {
    const { element, name, value } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-set-attribute', { detail }));
    element.setAttribute(name, value);
    element.dispatchEvent(new CustomEvent('cable-ready:after-set-attribute', { detail }));
  },

  removeAttribute: detail => {
    const { element, name } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-remove-attribute', { detail }));
    element.removeAttribute(name);
    element.dispatchEvent(new CustomEvent('cable-ready:after-remove-attribute', { detail }));
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: detail => {
    const { element, name } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-add-css-class', { detail }));
    element.classList.add(name);
    element.dispatchEvent(new CustomEvent('cable-ready:after-add-css-class', { detail }));
  },

  removeCssClass: detail => {
    const { element, name } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-remove-css-class', { detail }));
    element.classList.remove(name);
    element.dispatchEvent(new CustomEvent('cable-ready:after-remove-css-class', { detail }));
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: detail => {
    const { element, name, value } = detail;
    element.dispatchEvent(new CustomEvent('cable-ready:before-set-dataset-property', { detail }));
    element.dataset[name] = value;
    element.dispatchEvent(new CustomEvent('cable-ready:after-set-dataset-property', { detail }));
  },
};

const perform = operations => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name];
      for (let i = 0; i < entries.length; i++) {
        try {
          const detail = entries[i];
          if (detail.selector) {
            detail.element = detail.xpath
              ? xpathToElement(detail.selector)
              : document.querySelector(detail.selector);
          } else {
            detail.element = document;
          }
          DOMOperations[name](detail);
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`);
        }
      }
    }
  }
};

export default { perform };
