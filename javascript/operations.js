import morphdom from 'morphdom'
import { shouldMorph, didMorph } from './morph_callbacks'
import {
  assignFocus,
  dispatch,
  getClassNames,
  processElements,
  before,
  after,
  operate
} from './utils'

export default {
  // DOM Mutations

  append: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('beforeend', html || '')
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  graft: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { parent, focusSelector } = operation
        const parentElement = document.querySelector(parent)
        if (parentElement) {
          parentElement.appendChild(element)
          assignFocus(focusSelector)
        }
      })
      after(element, operation)
    })
  },

  innerHtml: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.innerHTML = html || ''
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  insertAdjacentHtml: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, position, focusSelector } = operation
        element.insertAdjacentHTML(position || 'beforeend', html || '')
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  insertAdjacentText: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { text, position, focusSelector } = operation
        element.insertAdjacentText(position || 'beforeend', text || '')
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  morph: operation => {
    processElements(operation, element => {
      const { html } = operation
      const template = document.createElement('template')
      template.innerHTML = String(html).trim()
      operation.content = template.content
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      before(element, operation)
      operate(operation, () => {
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
      })
      after(parent.children[ordinal], operation)
    })
  },

  outerHtml: operation => {
    processElements(operation, element => {
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      })
      after(parent.children[ordinal], operation)
    })
  },

  prepend: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('afterbegin', html || '')
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  remove: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { focusSelector } = operation
        element.remove()
        assignFocus(focusSelector)
      })
      after(document, operation)
    })
  },

  replace: operation => {
    processElements(operation, element => {
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      })
      after(parent.children[ordinal], operation)
    })
  },

  textContent: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { text, focusSelector } = operation
        element.textContent = text || ''
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  // Element Property Mutations

  addCssClass: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name } = operation
        element.classList.add(...getClassNames(name || ''))
      })
      after(element, operation)
    })
  },

  removeAttribute: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name } = operation
        element.removeAttribute(name)
      })
      after(element, operation)
    })
  },

  removeCssClass: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name } = operation
        element.classList.remove(...getClassNames(name))
      })
      after(element, operation)
    })
  },

  setAttribute: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.setAttribute(name, value || '')
      })
      after(element, operation)
    })
  },

  setDatasetProperty: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.dataset[name] = value || ''
      })
      after(element, operation)
    })
  },

  setProperty: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        if (name in element) element[name] = value || ''
      })
      after(element, operation)
    })
  },

  setStyle: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.style[name] = value || ''
      })
      after(element, operation)
    })
  },

  setStyles: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { styles } = operation
        for (let [name, value] of Object.entries(styles))
          element.style[name] = value || ''
      })
      after(element, operation)
    })
  },

  setValue: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { value } = operation
        element.value = value || ''
      })
      after(element, operation)
    })
  },

  // DOM Events

  dispatchEvent: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, detail } = operation
        dispatch(element, name, detail)
      })
      after(element, operation)
    })
  },

  setMeta: operation => {
    before(document, operation)
    operate(operation, () => {
      const { name, content } = operation
      let meta = document.head.querySelector(`meta[name='${name}']`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    })
    after(document, operation)
  },

  // Browser Manipulations

  clearStorage: operation => {
    before(document, operation)
    operate(operation, () => {
      const { type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.clear()
    })
    after(document, operation)
  },

  go: operation => {
    before(window, operation)
    operate(operation, () => {
      const { delta } = operation
      history.go(delta)
    })
    after(window, operation)
  },

  pushState: operation => {
    before(window, operation)
    operate(operation, () => {
      const { state, title, url } = operation
      history.pushState(state || {}, title || '', url)
    })
    after(window, operation)
  },

  redirectTo: operation => {
    before(window, operation)
    operate(operation, () => {
      let { url, action } = operation
      action = action || 'advance'
      if (window.Turbo) window.Turbo.visit(url, { action })
      if (window.Turbolinks) window.Turbolinks.visit(url, { action })
      if (!window.Turbo && !window.Turbolinks) window.location.href = url
    })
    after(window, operation)
  },

  reload: operation => {
    before(window, operation)
    operate(operation, () => {
      window.location.reload()
    })
    after(window, operation)
  },

  removeStorageItem: operation => {
    before(document, operation)
    operate(operation, () => {
      const { key, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.removeItem(key)
    })
    after(document, operation)
  },

  replaceState: operation => {
    before(window, operation)
    operate(operation, () => {
      const { state, title, url } = operation
      history.replaceState(state || {}, title || '', url)
    })
    after(window, operation)
  },

  scrollIntoView: operation => {
    const { element } = operation
    before(element, operation)
    operate(operation, () => {
      element.scrollIntoView(operation)
    })
    after(element, operation)
  },

  setCookie: operation => {
    before(document, operation)
    operate(operation, () => {
      const { cookie } = operation
      document.cookie = cookie || ''
    })
    after(document, operation)
  },

  setFocus: operation => {
    const { element } = operation
    before(element, operation)
    operate(operation, () => {
      assignFocus(element)
    })
    after(element, operation)
  },

  setStorageItem: operation => {
    before(document, operation)
    operate(operation, () => {
      const { key, value, type } = operation
      const storage = type === 'session' ? sessionStorage : localStorage
      storage.setItem(key, value || '')
    })
    after(document, operation)
  },

  // Notifications

  consoleLog: operation => {
    before(document, operation)
    operate(operation, () => {
      const { message, level } = operation
      level && ['warn', 'info', 'error'].includes(level)
        ? console[level](message || '')
        : console.log(message || '')
    })
    after(document, operation)
  },

  consoleTable: operation => {
    before(document, operation)
    operate(operation, () => {
      const { data, columns } = operation
      console.table(data, columns || [])
    })
    after(document, operation)
  },

  notification: operation => {
    before(document, operation)
    operate(operation, () => {
      const { title, options } = operation
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted') new Notification(title || '', options)
      })
    })
    after(document, operation)
  }
}
