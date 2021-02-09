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
      if (!operation.cancel) {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('beforeend', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  graft: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { parent, focusSelector } = operation
        const parentElement = document.querySelector(parent)
        if (parentElement) {
          parentElement.appendChild(element)
          assignFocus(focusSelector)
        }
      }
      after(element, callee, operation)
    })
  },

  innerHtml: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { html, focusSelector } = operation
        element.innerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  insertAdjacentHtml: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { html, position, focusSelector } = operation
        element.insertAdjacentHTML(position || 'beforeend', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  insertAdjacentText: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { text, position, focusSelector } = operation
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
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        const { childrenOnly, focusSelector } = operation
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
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(parent.children[ordinal], callee, operation)
    })
  },

  prepend: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('afterbegin', html || '')
        assignFocus(focusSelector)
      }
      after(element, callee, operation)
    })
  },

  remove: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { focusSelector } = operation
        element.remove()
        assignFocus(focusSelector)
      }
      after(document, callee, operation)
    })
  },

  replace: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      after(parent.children[ordinal], callee, operation)
    })
  },

  textContent: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { text, focusSelector } = operation
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
      if (!operation.cancel) {
        const { name } = operation
        element.classList.add(...getClassNames(name || ''))
      }
      after(element, callee, operation)
    })
  },

  removeAttribute: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name } = operation
        element.removeAttribute(name)
      }
      after(element, callee, operation)
    })
  },

  removeCssClass: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name } = operation
        element.classList.remove(...getClassNames(name))
      }
      after(element, callee, operation)
    })
  },

  setAttribute: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name, value } = operation
        element.setAttribute(name, value || '')
      }
      after(element, callee, operation)
    })
  },

  setDatasetProperty: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name, value } = operation
        element.dataset[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setProperty: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name, value } = operation
        if (name in element) element[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setStyle: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { name, value } = operation
        element.style[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setStyles: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { styles } = operation
        for (let [name, value] of Object.entries(styles))
          element.style[name] = value || ''
      }
      after(element, callee, operation)
    })
  },

  setValue: (operation, callee) => {
    processElements(operation, element => {
      before(element, callee, operation)
      if (!operation.cancel) {
        const { value } = operation
        element.value = value || ''
      }
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
    if (!operation.cancel) {
      const { type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.clear()
    }
    after(document, callee, operation)
  },

  go: (operation, callee) => {
    before(window, callee, operation)
    if (!operation.cancel) {
      const { delta } = operation
      history.go(delta)
    }
    after(window, callee, operation)
  },

  pushState: (operation, callee) => {
    before(window, callee, operation)
    if (!operation.cancel) {
      const { state, title, url } = operation
      history.pushState(state || {}, title || '', url)
    }
    after(window, callee, operation)
  },

  removeStorageItem: (operation, callee) => {
    before(document, callee, operation)
    if (!operation.cancel) {
      const { key, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.removeItem(key)
    }
    after(document, callee, operation)
  },

  replaceState: (operation, callee) => {
    before(window, callee, operation)
    if (!operation.cancel) {
      const { state, title, url } = operation
      history.replaceState(state || {}, title || '', url)
    }
    after(window, callee, operation)
  },

  scrollIntoView: (operation, callee) => {
    const { element } = operation
    before(element, callee, operation)
    if (!operation.cancel) {
      element.scrollIntoView(operation)
    }
    after(element, callee, operation)
  },

  setCookie: (operation, callee) => {
    before(document, callee, operation)
    if (!operation.cancel) {
      const { cookie } = operation
      document.cookie = cookie || ''
    }
    after(document, callee, operation)
  },

  setFocus: (operation, callee) => {
    const { element } = operation
    before(element, callee, operation)
    if (!operation.cancel) {
      assignFocus(element)
    }
    after(element, callee, operation)
  },

  setStorageItem: (operation, callee) => {
    before(document, callee, operation)
    if (!operation.cancel) {
      const { key, value, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.setItem(key, value || '')
    }
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
    if (!operation.cancel) {
      const { title, options } = operation
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted') new Notification(title || '', options)
      })
    }
    after(document, callee, operation)
  },

  playSound: (operation, callee) => {
    before(document, callee, operation)
    if (!operation.cancel) {
      const { src } = operation
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
