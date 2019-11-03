import morphdom from 'morphdom'

const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true }
  const evt = new Event(name, init)
  evt.detail = detail
  element.dispatchEvent(evt)
}

const xpathToElement = xpath => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
const shouldMorph = permanentAttributeName => (fromEl, toEl) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (fromEl.isEqualNode(toEl)) return false
  if (!permanentAttributeName) return true
  return !fromEl.closest(`[${permanentAttributeName}]`)
}

// Morphdom Callbacks ........................................................................................

const DOMOperations = {
  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    const { element, name, detail } = config
    dispatch(element, name, detail)
  },

  // Element Mutations .......................................................................................

  morph: detail => {
    const {
      element,
      html,
      childrenOnly,
      focusSelector,
      permanentAttributeName
    } = detail
    const template = document.createElement('template')
    template.innerHTML = String(html).trim()
    dispatch(element, 'cable-ready:before-morph', {
      ...detail,
      content: template.content
    })
    morphdom(element, template.content, {
      childrenOnly: !!childrenOnly,
      onBeforeElUpdated: shouldMorph(permanentAttributeName)
    })
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-morph', {
      ...detail,
      content: template.content
    })
  },

  innerHtml: detail => {
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-inner-html', detail)
    element.innerHTML = html
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-inner-html', detail)
  },

  outerHtml: detail => {
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-outer-html', detail)
    element.outerHTML = html
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-outer-html', detail)
  },

  textContent: detail => {
    const { element, text } = detail
    dispatch(element, 'cable-ready:before-text-content', detail)
    element.textContent = text
    dispatch(element, 'cable-ready:after-text-content', detail)
  },

  insertAdjacentHtml: detail => {
    const { element, html, position, focusSelector } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-html', detail)
    element.insertAdjacentHTML(position || 'beforeend', html)
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-insert-adjacent-html', detail)
  },

  insertAdjacentText: detail => {
    const { element, text, position } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-text', detail)
    element.insertAdjacentText(position || 'beforeend', text)
    dispatch(element, 'cable-ready:after-insert-adjacent-text', detail)
  },

  remove: detail => {
    const { element, focusSelector } = detail
    dispatch(element, 'cable-ready:before-remove', detail)
    element.remove()
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-remove', detail)
  },

  setValue: detail => {
    const { element, value } = detail
    dispatch(element, 'cable-ready:before-set-value', detail)
    element.value = value
    dispatch(element, 'cable-ready:after-set-value', detail)
  },

  // Attribute Mutations .....................................................................................

  setAttribute: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-attribute', detail)
    element.setAttribute(name, value)
    dispatch(element, 'cable-ready:after-set-attribute', detail)
  },

  removeAttribute: detail => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-remove-attribute', detail)
    element.removeAttribute(name)
    dispatch(element, 'cable-ready:after-remove-attribute', detail)
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: detail => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-add-css-class', detail)
    element.classList.add(name)
    dispatch(element, 'cable-ready:after-add-css-class', detail)
  },

  removeCssClass: detail => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-remove-css-class', detail)
    element.classList.remove(name)
    dispatch(element, 'cable-ready:after-remove-css-class', detail)
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-dataset-property', detail)
    element.dataset[name] = value
    dispatch(element, 'cable-ready:after-set-dataset-property', detail)
  }
}

const perform = operations => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        try {
          const detail = entries[i]
          if (detail.selector) {
            detail.element = detail.xpath
              ? xpathToElement(detail.selector)
              : document.querySelector(detail.selector)
          } else {
            detail.element = document
          }
          DOMOperations[name](detail)
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`)
        }
      }
    }
  }
}

export default { perform }
