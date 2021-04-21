import morphdom from 'morphdom'
import { shouldMorph, didMorph } from './morph_callbacks'
import { assignFocus, dispatch, getClassNames, processElements } from './utils'

export default {
  // DOM Mutations

  append: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-append', operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML('beforeend', html || '')
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-append', operation)
    })
  },

  graft: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-graft', operation)
      const { parent, focusSelector } = operation
      const parentElement = document.querySelector(parent)
      if (!operation.cancel && parentElement) {
        parentElement.appendChild(element)
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-graft', operation)
    })
  },

  innerHtml: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-inner-html', operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.innerHTML = html || ''
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-inner-html', operation)
    })
  },

  insertAdjacentHtml: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-insert-adjacent-html', operation)
      const { html, position, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML(position || 'beforeend', html || '')
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-insert-adjacent-html', operation)
    })
  },

  insertAdjacentText: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-insert-adjacent-text', operation)
      const { text, position, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentText(position || 'beforeend', text || '')
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-insert-adjacent-text', operation)
    })
  },

  morph: operation => {
    processElements(operation, element => {
      const { html } = operation
      const template = document.createElement('template')
      template.innerHTML = String(html).trim()
      operation.content = template.content
      dispatch(element, 'cable-ready:before-morph', operation)
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
      dispatch(parent.children[ordinal], 'cable-ready:after-morph', operation)
    })
  },

  outerHtml: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-outer-html', operation)
      const { html, focusSelector } = operation
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      dispatch(
        parent.children[ordinal],
        'cable-ready:after-outer-html',
        operation
      )
    })
  },

  prepend: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-prepend', operation)
      const { html, focusSelector } = operation
      if (!operation.cancel) {
        element.insertAdjacentHTML('afterbegin', html || '')
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-prepend', operation)
    })
  },

  remove: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-remove', operation)
      const { focusSelector } = operation
      if (!operation.cancel) {
        element.remove()
        assignFocus(focusSelector)
      }
      dispatch(document, 'cable-ready:after-remove', operation)
    })
  },

  replace: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-replace', operation)
      const { html, focusSelector } = operation
      const parent = element.parentElement
      const ordinal = Array.from(parent.children).indexOf(element)
      if (!operation.cancel) {
        element.outerHTML = html || ''
        assignFocus(focusSelector)
      }
      dispatch(parent.children[ordinal], 'cable-ready:after-replace', operation)
    })
  },

  textContent: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-text-content', operation)
      const { text, focusSelector } = operation
      if (!operation.cancel) {
        element.textContent = text || ''
        assignFocus(focusSelector)
      }
      dispatch(element, 'cable-ready:after-text-content', operation)
    })
  },

  // Element Property Mutations

  addCssClass: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-add-css-class', operation)
      const { name } = operation
      if (!operation.cancel) element.classList.add(...getClassNames(name || ''))
      dispatch(element, 'cable-ready:after-add-css-class', operation)
    })
  },

  removeAttribute: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-remove-attribute', operation)
      const { name } = operation
      if (!operation.cancel) element.removeAttribute(name)
      dispatch(element, 'cable-ready:after-remove-attribute', operation)
    })
  },

  removeCssClass: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-remove-css-class', operation)
      const { name } = operation
      if (!operation.cancel) element.classList.remove(...getClassNames(name))
      dispatch(element, 'cable-ready:after-remove-css-class', operation)
    })
  },

  setAttribute: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-attribute', operation)
      const { name, value } = operation
      if (!operation.cancel) element.setAttribute(name, value || '')
      dispatch(element, 'cable-ready:after-set-attribute', operation)
    })
  },

  setDatasetProperty: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-dataset-property', operation)
      const { name, value } = operation
      if (!operation.cancel) element.dataset[name] = value || ''
      dispatch(element, 'cable-ready:after-set-dataset-property', operation)
    })
  },

  setProperty: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-property', operation)
      const { name, value } = operation
      if (!operation.cancel && name in element) element[name] = value || ''
      dispatch(element, 'cable-ready:after-set-property', operation)
    })
  },

  setStyle: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-style', operation)
      const { name, value } = operation
      if (!operation.cancel) element.style[name] = value || ''
      dispatch(element, 'cable-ready:after-set-style', operation)
    })
  },

  setStyles: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-styles', operation)
      const { styles } = operation
      for (let [name, value] of Object.entries(styles)) {
        if (!operation.cancel) element.style[name] = value || ''
      }
      dispatch(element, 'cable-ready:after-set-styles', operation)
    })
  },

  setValue: operation => {
    processElements(operation, element => {
      dispatch(element, 'cable-ready:before-set-value', operation)
      const { value } = operation
      if (!operation.cancel) element.value = value || ''
      dispatch(element, 'cable-ready:after-set-value', operation)
    })
  },

  // DOM Events

  dispatchEvent: operation => {
    processElements(operation, element => {
      const { name, detail } = operation
      dispatch(element, name, detail)
    })
  },

  setMeta: operation => {
    dispatch(document, 'cable-ready:before-set-meta', operation)
    const { name, content } = operation
    if (!operation.cancel) {
      let meta = document.head.querySelector(`meta[name='${name}']`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }
    dispatch(document, 'cable-ready:after-set-meta', operation)
  },

  // Browser Manipulations

  clearStorage: operation => {
    dispatch(document, 'cable-ready:before-clear-storage', operation)
    const { type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.clear()
    dispatch(document, 'cable-ready:after-clear-storage', operation)
  },

  go: operation => {
    dispatch(window, 'cable-ready:before-go', operation)
    const { delta } = operation
    if (!operation.cancel) history.go(delta)
    dispatch(window, 'cable-ready:after-go', operation)
  },

  pushState: operation => {
    dispatch(window, 'cable-ready:before-push-state', operation)
    const { state, title, url } = operation
    if (!operation.cancel) history.pushState(state || {}, title || '', url)
    dispatch(window, 'cable-ready:after-push-state', operation)
  },

  removeStorageItem: operation => {
    dispatch(document, 'cable-ready:before-remove-storage-item', operation)
    const { key, type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.removeItem(key)
    dispatch(document, 'cable-ready:after-remove-storage-item', operation)
  },

  replaceState: operation => {
    dispatch(window, 'cable-ready:before-replace-state', operation)
    const { state, title, url } = operation
    if (!operation.cancel) history.replaceState(state || {}, title || '', url)
    dispatch(window, 'cable-ready:after-replace-state', operation)
  },

  scrollIntoView: operation => {
    const { element } = operation
    dispatch(element, 'cable-ready:before-scroll-into-view', operation)
    if (!operation.cancel) element.scrollIntoView(operation)
    dispatch(element, 'cable-ready:after-scroll-into-view', operation)
  },

  setCookie: operation => {
    dispatch(document, 'cable-ready:before-set-cookie', operation)
    const { cookie } = operation
    if (!operation.cancel) document.cookie = cookie || ''
    dispatch(document, 'cable-ready:after-set-cookie', operation)
  },

  setFocus: operation => {
    const { element } = operation
    dispatch(element, 'cable-ready:before-set-focus', operation)
    if (!operation.cancel) assignFocus(element)
    dispatch(element, 'cable-ready:after-set-focus', operation)
  },

  setStorageItem: operation => {
    dispatch(document, 'cable-ready:before-set-storage-item', operation)
    const { key, value, type } = operation
    const storage = type === 'session' ? sessionStorage : localStorage
    if (!operation.cancel) storage.setItem(key, value || '')
    dispatch(document, 'cable-ready:after-set-storage-item', operation)
  },

  // Notifications

  consoleLog: operation => {
    const { message, level } = operation
    level && ['warn', 'info', 'error'].includes(level)
      ? console[level](message || '')
      : console.log(message || '')
  },

  notification: operation => {
    dispatch(document, 'cable-ready:before-notification', operation)
    const { title, options } = operation
    if (!operation.cancel)
      Notification.requestPermission().then(result => {
        operation.permission = result
        if (result === 'granted') new Notification(title || '', options)
      })
    dispatch(document, 'cable-ready:after-notification', operation)
  },

  playSound: operation => {
    dispatch(document, 'cable-ready:before-play-sound', operation)
    const { src } = operation
    if (!operation.cancel) {
      const canplaythrough = () => {
        document.audio.removeEventListener('canplaythrough', canplaythrough)
        document.audio.play()
      }
      const ended = () => {
        document.audio.removeEventListener('ended', ended)
        dispatch(document, 'cable-ready:after-play-sound', operation)
      }
      if (document.body.hasAttribute('data-unlock-audio')) {
        document.audio.addEventListener('canplaythrough', canplaythrough)
        document.audio.addEventListener('ended', ended)
        if (src) document.audio.src = src
        document.audio.play()
      } else dispatch(document, 'cable-ready:after-play-sound', operation)
    } else dispatch(document, 'cable-ready:after-play-sound', operation)
  }
}
