import morphdom from 'morphdom'
import { dispatch, isTextInput, state } from '../util'

// Assigns focus to the appropriate element... preferring the explicitly passed focusSelector
//
// * focusSelector - a CSS selector for the element that should have focus
//
const assignFocus = focusSelector => {
  const focusElement = focusSelector
    ? document.querySelector(focusSelector)
    : state.activeElement
  if (focusElement) focusElement.focus()
}

// Indicates whether or not we should morph an element
// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
//
const shouldMorph = permanentAttributeName => (fromEl, toEl) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (fromEl.isEqualNode(toEl)) return false
  if (!permanentAttributeName) return true

  const permanent = fromEl.closest(`[${permanentAttributeName}]`)

  // only morph attributes on the active non-permanent text input
  if (!permanent && isTextInput(fromEl) && fromEl === state.activeElement) {
    const ignore = { value: true }
    Array.from(toEl.attributes).forEach(attribute => {
      if (!ignore[attribute.name])
        fromEl.setAttribute(attribute.name, attribute.value)
    })
    return false
  }

  return !permanent
}

export default {
  // Element Mutations .......................................................................................

  morph: detail => {
    state.activeElement = document.activeElement
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
    const parent = element.parentElement
    const ordinal = Array.from(parent.children).indexOf(element)
    morphdom(element, childrenOnly ? template.content : template.innerHTML, {
      childrenOnly: !!childrenOnly,
      onBeforeElUpdated: shouldMorph(permanentAttributeName)
    })
    assignFocus(focusSelector)
    dispatch(parent.children[ordinal], 'cable-ready:after-morph', {
      ...detail,
      content: template.content
    })
  },

  innerHtml: detail => {
    state.activeElement = document.activeElement
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-inner-html', detail)
    element.innerHTML = html
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-inner-html', detail)
  },

  outerHtml: detail => {
    state.activeElement = document.activeElement
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-outer-html', detail)
    const parent = element.parentElement
    const ordinal = Array.from(parent.children).indexOf(element)
    element.outerHTML = html
    assignFocus(focusSelector)
    dispatch(parent.children[ordinal], 'cable-ready:after-outer-html', detail)
  },

  textContent: detail => {
    const { element, text } = detail
    dispatch(element, 'cable-ready:before-text-content', detail)
    element.textContent = text
    dispatch(element, 'cable-ready:after-text-content', detail)
  },

  insertAdjacentHtml: detail => {
    state.activeElement = document.activeElement
    const { element, html, position, focusSelector } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-html', detail)
    element.insertAdjacentHTML(position || 'beforeend', html)
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-insert-adjacent-html', detail)
  },

  insertAdjacentText: detail => {
    const { element, text, position } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-text', detail)
    element.insertAdjacentText(position || 'beforeend', text)
    dispatch(element, 'cable-ready:after-insert-adjacent-text', detail)
  },

  remove: detail => {
    state.activeElement = document.activeElement
    const { element, focusSelector } = detail
    dispatch(element, 'cable-ready:before-remove', detail)
    element.remove()
    assignFocus(focusSelector)
    dispatch(element, 'cable-ready:after-remove', detail)
  },

  setProperty: detail => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-property', detail)
    if (name in element) element[name] = value
    dispatch(element, 'cable-ready:after-set-property', detail)
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
