import morphdom from 'morphdom'

import { shouldMorph, didMorph } from './morph_callbacks'
import {
  assignFocus,
  dispatch,
  getClassNames,
  processElements,
  before,
  after,
  operate,
  safeScalar,
  safeString,
  safeArray,
  safeObject,
  safeStringOrArray
} from './utils'

export default {
  // DOM Mutations

  append: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('beforeend', safeScalar(html))
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
        element.innerHTML = safeScalar(html)
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
        element.insertAdjacentHTML(position || 'beforeend', safeScalar(html))
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
        element.insertAdjacentText(position || 'beforeend', safeScalar(text))
        assignFocus(focusSelector)
      })
      after(element, operation)
    })
  },

  outerHtml: operation => {
    processElements(operation, element => {
      const parent = element.parentElement
      const idx = parent && Array.from(parent.children).indexOf(element)
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = safeScalar(html)
        assignFocus(focusSelector)
      })
      after(parent ? parent.children[idx] : document.documentElement, operation)
    })
  },

  prepend: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.insertAdjacentHTML('afterbegin', safeScalar(html))
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
      const idx = parent && Array.from(parent.children).indexOf(element)
      before(element, operation)
      operate(operation, () => {
        const { html, focusSelector } = operation
        element.outerHTML = safeScalar(html)
        assignFocus(focusSelector)
      })
      after(parent ? parent.children[idx] : document.documentElement, operation)
    })
  },

  textContent: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { text, focusSelector } = operation
        element.textContent = safeScalar(text)
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
        element.classList.add(...getClassNames([safeStringOrArray(name)]))
      })
      after(element, operation)
    })
  },

  removeAttribute: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name } = operation
        element.removeAttribute(safeString(name))
      })
      after(element, operation)
    })
  },

  removeCssClass: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name } = operation
        element.classList.remove(...getClassNames([safeStringOrArray(name)]))
        if (element.classList.length === 0) element.removeAttribute('class')
      })
      after(element, operation)
    })
  },

  setAttribute: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.setAttribute(safeString(name), safeScalar(value))
      })
      after(element, operation)
    })
  },

  setDatasetProperty: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.dataset[safeString(name)] = safeScalar(value)
      })
      after(element, operation)
    })
  },

  setProperty: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        if (name in element) element[safeString(name)] = safeScalar(value)
      })
      after(element, operation)
    })
  },

  setStyle: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, value } = operation
        element.style[safeString(name)] = safeScalar(value)
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
          element.style[safeString(name)] = safeScalar(value)
      })
      after(element, operation)
    })
  },

  setValue: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { value } = operation
        element.value = safeScalar(value)
      })
      after(element, operation)
    })
  },

  // DOM Events and Meta-Operations

  dispatchEvent: operation => {
    processElements(operation, element => {
      before(element, operation)
      operate(operation, () => {
        const { name, detail } = operation
        dispatch(element, safeString(name), safeObject(detail))
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
        meta.name = safeString(name)
        document.head.appendChild(meta)
      }
      meta.content = safeScalar(content)
    })
    after(document, operation)
  },

  setTitle: operation => {
    before(document, operation)
    operate(operation, () => {
      const { title } = operation
      document.title = safeScalar(title)
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
      history.pushState(safeObject(state), safeString(title), safeString(url))
    })
    after(window, operation)
  },

  redirectTo: operation => {
    before(window, operation)
    operate(operation, () => {
      let { url, action, turbo } = operation
      action = action || 'advance'
      url = safeString(url)
      if (turbo === undefined) turbo = true

      if (turbo) {
        if (window.Turbo) window.Turbo.visit(url, { action })
        if (window.Turbolinks) window.Turbolinks.visit(url, { action })
        if (!window.Turbo && !window.Turbolinks) window.location.href = url
      } else {
        window.location.href = url
      }
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
      storage.removeItem(safeString(key))
    })
    after(document, operation)
  },

  replaceState: operation => {
    before(window, operation)
    operate(operation, () => {
      const { state, title, url } = operation
      history.replaceState(
        safeObject(state),
        safeString(title),
        safeString(url)
      )
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
      document.cookie = safeScalar(cookie)
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
      storage.setItem(safeString(key), safeScalar(value))
    })
    after(document, operation)
  },

  // Notifications

  consoleLog: operation => {
    before(document, operation)
    operate(operation, () => {
      const { message, level } = operation
      level && ['warn', 'info', 'error'].includes(level)
        ? console[level](message)
        : console.log(message)
    })
    after(document, operation)
  },

  consoleTable: operation => {
    before(document, operation)
    operate(operation, () => {
      const { data, columns } = operation
      console.table(data, safeArray(columns))
    })
    after(document, operation)
  },

  notification: operation => {
    before(document, operation)
    operate(operation, () => {
      const { title, options } = operation
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted')
          new Notification(safeString(title), safeObject(options))
      })
    })
    after(document, operation)
  },

  // Morph operations

  morph: operation => {
    processElements(operation, element => {
      const { html } = operation
      const template = document.createElement('template')
      template.innerHTML = String(safeScalar(html)).trim()
      operation.content = template.content
      const parent = element.parentElement
      const idx = parent && Array.from(parent.children).indexOf(element)
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
      after(parent ? parent.children[idx] : document.documentElement, operation)
    })
  }
}
