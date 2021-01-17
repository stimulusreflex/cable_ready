import { inputTags, textInputTypes } from './enums'
import { activeElement } from './cable_ready'

// Indicates if the passed element is considered a text input.
//
export const isTextInput = element => {
  return inputTags[element.tagName] && textInputTypes[element.type]
}

// Assigns focus to the appropriate element... preferring the explicitly passed selector
//
// * selector - a CSS selector for the element that should have focus
//
export const assignFocus = selector => {
  const element =
    selector && selector.nodeType === Node.ELEMENT_NODE
      ? selector
      : document.querySelector(selector)
  const focusElement = element || activeElement
  if (focusElement && focusElement.focus) focusElement.focus()
}

// Dispatches an event on the passed element
//
// * element - the element
// * name - the name of the event
// * detail - the event detail
//
export const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true, detail: detail }
  const evt = new CustomEvent(name, init)
  element.dispatchEvent(evt)
  if (window.jQuery) window.jQuery(element).trigger(name, detail)
}

// Accepts an xPath query and returns the element found at that position in the DOM
//
export const xpathToElement = xpath => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

// Return an array with the class names to be used
//
// * names - could be a string or an array of strings for multiple classes.
//
export const getClassNames = names => Array(names).flat()

// Perform operation for either the first or all of the elements returned by CSS selector
//
// * operation - the instruction payload from perform
// * callback - the operation function to run for each element
//
export const processElements = (operation, callback) => {
  Array.from(
    operation.selectAll ? operation.element : [operation.element]
  ).forEach(callback)
}
