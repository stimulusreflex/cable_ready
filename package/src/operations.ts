import morphdom from 'morphdom';

import { dispatch, shouldMorph } from './constants';
import { Config, Detail } from './types';

// Morphdom Callbacks ........................................................................................

export const DOMOperations = {

  // DOM Events ..............................................................................................

  dispatchEvent: (config: Config) => {
    const { element, name, detail } = config
    dispatch(element, name, detail)
  },

  // Element Mutations .......................................................................................

  morph: (detail: Detail) => {
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
    // TODO
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-morph', {
      ...detail,
      content: template.content
    })
  },

  innerHtml: (detail: Detail) => {
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-inner-html', detail)
    element.innerHTML = html
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-inner-html', detail)
  },

  outerHtml: (detail: Detail) => {
    const { element, html, focusSelector } = detail
    dispatch(element, 'cable-ready:before-outer-html', detail)
    element.outerHTML = html
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-outer-html', detail)
  },

  textContent: (detail: Detail) => {
    const { element, text } = detail
    dispatch(element, 'cable-ready:before-text-content', detail)
    element.textContent = text
    dispatch(element, 'cable-ready:after-text-content', detail)
  },

  insertAdjacentHtml: (detail: Detail) => {
    const { element, html, position, focusSelector } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-html', detail)
    // Can do this a lot better now
    element.insertAdjacentHTML(position || 'beforeend', html)
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-insert-adjacent-html', detail)
  },

  insertAdjacentText: (detail: Detail) => {
    const { element, text, position } = detail
    dispatch(element, 'cable-ready:before-insert-adjacent-text', detail)
    element.insertAdjacentText(position || 'beforeend', text)
    dispatch(element, 'cable-ready:after-insert-adjacent-text', detail)
  },

  remove: (detail: Detail) => {
    const { element, focusSelector } = detail
    dispatch(element, 'cable-ready:before-remove', detail)
    element.remove()
    if (focusSelector) document.querySelector(focusSelector).focus()
    dispatch(element, 'cable-ready:after-remove', detail)
  },

  setValue: (detail: Detail) => {
    const { element, value } = detail
    dispatch(element, 'cable-ready:before-set-value', detail)
    element.value = value
    dispatch(element, 'cable-ready:after-set-value', detail)
  },

  // Attribute Mutations .....................................................................................

  setAttribute: (detail: Detail) => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-attribute', detail)
    element.setAttribute(name, value)
    dispatch(element, 'cable-ready:after-set-attribute', detail)
  },

  removeAttribute: (detail: Detail) => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-remove-attribute', detail)
    element.removeAttribute(name)
    dispatch(element, 'cable-ready:after-remove-attribute', detail)
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: (detail: Detail) => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-add-css-class', detail)
    element.classList.add(name)
    dispatch(element, 'cable-ready:after-add-css-class', detail)
  },

  removeCssClass: (detail: Detail) => {
    const { element, name } = detail
    dispatch(element, 'cable-ready:before-remove-css-class', detail)
    element.classList.remove(name)
    dispatch(element, 'cable-ready:after-remove-css-class', detail)
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: (detail: Detail) => {
    const { element, name, value } = detail
    dispatch(element, 'cable-ready:before-set-dataset-property', detail)
    element.dataset[name] = value
    dispatch(element, 'cable-ready:after-set-dataset-property', detail)
  }
}
