import { inputTags, textInputTypes } from './enums'
import activeElement from './active_element'

// Indicates if the passed element is considered a text input.
//
const isTextInput = element => {
  return inputTags[element.tagName] && textInputTypes[element.type]
}

// Assigns focus to the appropriate element... preferring the explicitly passed selector
//
// * selector - a CSS selector for the element that should have focus
//
const assignFocus = selector => {
  const element =
    selector && selector.nodeType === Node.ELEMENT_NODE
      ? selector
      : document.querySelector(selector)
  const focusElement = element || activeElement.element
  if (focusElement && focusElement.focus) focusElement.focus()
}

// Dispatches an event on the passed element
//
// * element - the element
// * name - the name of the event
// * detail - the event detail
//
const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true, detail: detail }
  const evt = new CustomEvent(name, init)
  element.dispatchEvent(evt)
  if (window.jQuery) window.jQuery(element).trigger(name, detail)
}

// Accepts an xPath query and returns the element found at that position in the DOM
//
const xpathToElement = xpath => {
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
const getClassNames = names => Array(names).flat()

// Perform operation for either the first or all of the elements returned by CSS selector
//
// * operation - the instruction payload from perform
// * callback - the operation function to run for each element
//
const processElements = (operation, callback) => {
  Array.from(
    operation.selectAll ? operation.element : [operation.element]
  ).forEach(callback)
}

// camelCase to kebab-case
//
const kebabize = str => {
  return str
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter
    })
    .join('')
}

// Provide a standardized pipeline of checks and modifications to all operations based on provided options
// Currently skips execution if cancelled and implements an optional delay
//
const operate = (operation, callback) => {
  if (!operation.cancel) {
    operation.delay ? setTimeout(callback, operation.delay) : callback()
    return true
  }
  return false
}

// Dispatch life-cycle events with standardized naming
const before = (target, operation) =>
  dispatch(
    target,
    `cable-ready:before-${kebabize(operation.operation)}`,
    operation
  )

const after = (target, operation) =>
  dispatch(
    target,
    `cable-ready:after-${kebabize(operation.operation)}`,
    operation
  )

function debounce (func, timeout) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

function handleErrors (response) {
  if (!response.ok) throw Error(response.statusText)
  return response
}

// A proxy method to wrap a fetch call in error handling
//
// * url - the URL to fetch
// * additionalHeaders - an object of additional headers passed to fetch
//
async function graciouslyFetch (url, additionalHeaders) {
  try {
    const response = await fetch(url, {
      headers: {
        'X-REQUESTED-WITH': 'XmlHttpRequest',
        ...additionalHeaders
      }
    })
    if (response == undefined) return

    handleErrors(response)

    return response
  } catch (e) {
    console.error(`Could not fetch ${url}`)
  }
}

export {
  isTextInput,
  assignFocus,
  dispatch,
  xpathToElement,
  getClassNames,
  processElements,
  operate,
  before,
  after,
  debounce,
  handleErrors,
  graciouslyFetch
}
