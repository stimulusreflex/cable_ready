import morphdom from 'morphdom'
import { shouldMorph, didMorph } from './morph_callbacks'
import {
  assignFocus,
  dispatch,
  getClassNames,
  processElements,
  before,
  after
} from './utils'

export default {
  // DOM Mutations

  append: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML('beforeend', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  graft: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { parent, focusSelector } = operation
      const parentElement = document.querySelector(parent)
      if (!operation.cancel && parentElement) {
        parentElement.appendChild(element)
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  innerHtml: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.innerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  insertAdjacentHtml: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, position, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML(position || 'beforeend', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  insertAdjacentText: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { text, position, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentText(position || 'beforeend', text || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  morph: (operation, callee) => {
    processElements(operation, element => {
      const { html } = operation
      const template = document.createElement('template')
      template.innerHTML = String(html).trim()
      operation.content = template.content
      before(element, callee, operation)
      const { childrenOnly, focusSelector } = operation
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        morphdom(
          element,
          childrenOnly ? template.content : template.innerHTML,
          {
            childrenOnly: !!childrenOnly,
            onBeforeElUpdated: shouldMorph(operation),
            onElUpdated: didMorph(operation)
          }
        )
        assignFocus(focusSelector)
      }
      after(parent.children[ordinal], callee, operation)
    })
  },

  outerHtml: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, focusSelector } = operation
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(parent.children[ordinal], callee, operation)
    })
  },

  prepend: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML('afterbegin', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  remove: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { focusSelector } = operation
      if (!operation.cancel) {
        element.remove()
        assignFocus(focusSelector)
      }
      after(document, callee, operation)
    })
  },

  replace: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { html, focusSelector } = operation
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(parent.children[ordinal], callee, operation)
    })
  },

  textContent: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { text, focusSelector } = operation
      if (!operation.cancel) {
        element.textContent = text || ''
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  // Element Property Mutations

  addCssClass: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name } = operation
      if (!operation.cancel) element.classList.add(...getClassNames(name || ''))
      after(element, callee, operation)
    })
  },

  removeAttribute: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name } = operation
      if (!operation.cancel) element.removeAttribute(name)
      after(element, callee, operation)
    })
  },

  removeCssClass: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name } = operation
      if (!operation.cancel) element.classList.remove(...getClassNames(name))
      after(element, callee, operation)
    })
  },

  setAttribute: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name, value } = operation
      if (!operation.cancel) element.setAttribute(name, value || '')
      after(element, callee, operation)
    })
  },

  setDatasetProperty: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name, value } = operation
      if (!operation.cancel) element.dataset[name] = value || ''
      after(element, callee, operation)
    })
  },

  setProperty: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name, value } = operation
      if (!operation.cancel) {
        if (name in element) element[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setStyle: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { name, value } = operation
      if (!operation.cancel) element.style[name] = value || ''
      after(element, callee, operation)
    })
  },

  setStyles: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { styles } = operation
      for (let [name, value] of Object.entries(styles)) {
        if (!operation.cancel) element.style[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setValue: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const { value } = operation
      if (!operation.cancel) element.value = value || ''
      after(element, callee, operation)
    })
  },

  // DOM Events

  dispatchEvent: (operation, callee) => {
    processElements(operation, element => {
      if (!operation.cancel) {
        const { name, detail } = operation
        dispatch(element, name, detail)
      }
    })
  },

  // Browser Manipulations

  clearStorage: (operation, callee) => {
    before(document, callee, operation)
    const { type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.clear()
    after(document, callee, operation)
  },

  go: (operation, callee) => {
    before(window, callee, operation)
    const { delta } = operation
    if (!operation.cancel) history.go(delta)
    after(window, callee, operation)
  },

  pushState: (operation, callee) => {
    before(window, callee, operation)
    const { state, title, url } = operation
    if (!operation.cancel) history.pushState(state || {}, title || '', url)
    after(window, callee, operation)
  },

  removeStorageItem: (operation, callee) => {
    before(document, callee, operation)
    const { key, type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.removeItem(key)
    after(document, callee, operation)
  },

  replaceState: (operation, callee) => {
    before(window, callee, operation)
    const { state, title, url } = operation
    if (!operation.cancel) history.replaceState(state || {}, title || '', url)
    after(window, callee, operation)
  },

  scrollIntoView: (operation, callee) => {
    const { element } = operation
    before(element, callee, operation)
    if (!operation.cancel) element.scrollIntoView(operation)
    after(element, callee, operation)
  },

  setCookie: (operation, callee) => {
    before(document, callee, operation)
    const { cookie } = operation
    if (!operation.cancel) document.cookie = cookie || ''
    after(document, callee, operation)
  },

  setFocus: (operation, callee) => {
    const { element } = operation
    before(element, callee, operation)
    if (!operation.cancel) assignFocus(element)
    after(element, callee, operation)
  },

  setStorageItem: (operation, callee) => {
    before(document, callee, operation)
    const { key, value, type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.setItem(key, value || '')
    after(document, callee, operation)
  },

  // Notifications

  consoleLog: (operation, callee) => {
    if (!operation.cancel) {
      const { message, level } = operation
      level && ['warn', 'info', 'error'].includes(level)
        ? console[level](message || '')
        : console.log(message || '')
    }
  },

  notification: (operation, callee) => {
    before(document, callee, operation)
    const { title, options } = operation
    if (!operation.cancel)
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted') new Notification(title || '', options)
      })
    after(document, callee, operation)
  },

  playSound: (operation, callee) => {
    before(document, callee, operation)
    const { src } = operation
    if (!operation.cancel) {
      const canplaythrough = () => {
        document.audio.removeEventListener('canplaythrough', canplaythrough)
        document.audio.play()
      }
      const ended = () => {
        document.audio.removeEventListener('ended', canplaythrough)
        after(document, callee, operation)
      }
      document.audio.addEventListener('canplaythrough', canplaythrough)
      document.audio.addEventListener('ended', ended)
      if (src) document.audio.src = src
      document.audio.play()
    }
    if (operation.cancel) document(element, callee, operation)
  }
}
