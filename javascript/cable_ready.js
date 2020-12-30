import morphdom from 'morphdom'
import { verifyNotMutable, verifyNotPermanent } from './callbacks'
import { assignFocus, dispatch, xpathToElement, getClassNames } from './utils'

export let activeElement

const shouldMorphCallbacks = [verifyNotMutable, verifyNotPermanent]
const didMorphCallbacks = []

// Indicates whether or not we should morph an element via onBeforeElUpdated callback
// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
//
const shouldMorph = detail => (fromEl, toEl) => {
  return !shouldMorphCallbacks
    .map(callback => {
      return typeof callback === 'function'
        ? callback(detail, fromEl, toEl)
        : true
    })
    .includes(false)
}

// Execute any pluggable functions that modify elements after morphing via onElUpdated callback
//
const didMorph = detail => el => {
  didMorphCallbacks.forEach(callback => {
    if (typeof callback === 'function') callback(detail, el)
  })
}

// Morphdom Callbacks ........................................................................................

const DOMOperations = {
  // Navigation ..............................................................................................

  pushState: config => {
    const { state, title, url } = config
    dispatch(document, 'cable-ready:before-push-state', config)
    history.pushState(state || {}, title || '', url)
    dispatch(document, 'cable-ready:after-push-state', config)
  },

  // Storage .................................................................................................

  setStorageItem: config => {
    const { key, value, type } = config
    const storage = type === 'session' ? sessionStorage : localStorage
    dispatch(document, 'cable-ready:before-set-storage-item', config)
    storage.setItem(key, value)
    dispatch(document, 'cable-ready:after-set-storage-item', config)
  },

  removeStorageItem: config => {
    const { key, type } = config
    const storage = type === 'session' ? sessionStorage : localStorage
    dispatch(document, 'cable-ready:before-remove-storage-item', config)
    storage.removeItem(key)
    dispatch(document, 'cable-ready:after-remove-storage-item', config)
  },

  clearStorage: config => {
    const { type } = config
    const storage = type === 'session' ? sessionStorage : localStorage
    dispatch(document, 'cable-ready:before-clear-storage', config)
    storage.clear()
    dispatch(document, 'cable-ready:after-clear-storage', config)
  },

  // Notifications ...........................................................................................

  consoleLog: config => {
    const { message, level } = config
    level && ['warn', 'info', 'error'].includes(level)
      ? console[level](message)
      : console.log(message)
  },

  notification: config => {
    const { title, options } = config
    dispatch(document, 'cable-ready:before-notification', config)
    let permission
    Notification.requestPermission().then(result => {
      permission = result
      if (result === 'granted') new Notification(title || '', options)
      dispatch(document, 'cable-ready:after-notification', {
        ...config,
        permission
      })
    })
  },

  // Cookies .................................................................................................

  setCookie: config => {
    const { cookie } = config
    dispatch(document, 'cable-ready:before-set-cookie', config)
    document.cookie = cookie
    dispatch(document, 'cable-ready:after-set-cookie', config)
  },

  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    const { element, name, detail } = config
    dispatch(element, name, detail)
  },

  // Element Mutations .......................................................................................

  morph: detail => {
    activeElement = document.activeElement
    const { element, html, childrenOnly, focusSelector } = detail
    const template = document.createElement('template')
    template.innerHTML = String(html).trim()
    dispatch(element, 'cable-ready:before-morph', {
      ...detail,
      content: template.content
    })
    const parent = element.parentElement
    const ordinal = Array.from(parent.children).indexOf(element)
    morphdom(element, childrenOnly ? template.content : template.innerHTML, {
      childrenOnly: !!childrenOnly,
      onBeforeElUpdated: shouldMorph(detail),
      onElUpdated: didMorph(detail)
    })
    assignFocus(focusSelector)
    dispatch(parent.children[ordinal], 'cable-ready:after-morph', {
      ...detail,
      content: template.content
    })
  },

  innerHtml: detail => {
    activeElement = document.activeElement
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-inner-html', detail)
    element.innerHTML = html
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-inner-html', detail)
  },

  outerHtml: detail => {
    activeElement = document.activeElement
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-outer-html', detail)
    const parent = element.parentElement
    const ordinal = Array.from(parent.children).indexOf(element)
    element.outerHTML = html
    assignFocus(focusSelector)
    dispatch(parent.children[ordinal], 'cable-ready:after-outer-html', detail)
  },

  textContent: detail => {
    activeElement = document.activeElement
    const { element, text, focusSelector } = detail
    dispatch(element, 'cable-ready:before-text-content', detail)
    element.textContent = text
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-text-content', detail)
  },

  insertAdjacentHtml: detail => {
    activeElement = document.activeElement
    const { element, html, position, focusSelector } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-html', detail)
    element.insertAdjacentHTML(position || 'beforeend', html)
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-insert-adjacent-html', detail)
  },

  insertAdjacentText: detail => {
    activeElement = document.activeElement
    const { element, text, position, focusSelector } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-text', detail)
    element.insertAdjacentText(position || 'beforeend', text)
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-insert-adjacent-text', detail)
  },

  remove: detail => {
    activeElement = document.activeElement
    const { element, focusSelector } = detail
    dispatch(element, 'cable-ready:before-remove', detail)
    element.remove()
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-remove', detail)
  },

  setFocus: detail => {
    activeElement = document.activeElement
    const { element } = detail
    dispatch(element, 'cable-ready:before-set-focus', detail)
    assignFocus(element)
    dispatch(element, 'cable-ready:after-set-focus', detail)
  },

  setProperty: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-property', detail)
    if (name in element) element[name] = value
    dispatch(element, 'cable-ready:after-set-property', detail)
  },

  setValue: detail => {
    activeElement = document.activeElement
    const { element, value, focusSelector } = detail
    dispatch(element, 'cable-ready:before-set-value', detail)
    element.value = value
    assignFocus(focusSelector)
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
    element.classList.add(...getClassNames(name))
    dispatch(element, 'cable-ready:after-add-css-class', detail)
  },

  removeCssClass: detail => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-remove-css-class', detail)
    element.classList.remove(...getClassNames(name))
    dispatch(element, 'cable-ready:after-remove-css-class', detail)
  },

  // Style Mutations .......................................................................................

  setStyle: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-style', detail)
    element.style[name] = value
    dispatch(element, 'cable-ready:after-set-style', detail)
  },

  setStyles: detail => {
    const { element, styles } = detail
    dispatch(element, 'cable-ready:before-set-styles', detail)
    for (let [name, value] of Object.entries(styles)) {
      element.style[name] = value
    }
    dispatch(element, 'cable-ready:after-set-styles', detail)
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-dataset-property', detail)
    element.dataset[name] = value
    dispatch(element, 'cable-ready:after-set-dataset-property', detail)
  }
}

const perform = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        const detail = entries[i]
        try {
          if (detail.selector) {
            detail.element = detail.xpath
              ? xpathToElement(detail.selector)
              : document.querySelector(detail.selector)
          } else {
            detail.element = document
          }
          if (detail.element || options.emitMissingElementWarnings)
            DOMOperations[name](detail)
        } catch (e) {
          if (detail.element) {
            console.error(
              `CableReady detected an error in ${name}! ${e.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`
            )
            console.error(e)
          } else {
            console.log(
              `CableReady ${name} failed due to missing DOM element for selector: '${detail.selector}'`
            )
          }
        }
      }
    }
  }
}

const performAsync = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(perform(operations, options))
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  perform,
  performAsync,
  DOMOperations,
  shouldMorphCallbacks,
  didMorphCallbacks
}
export * from './registerController'
