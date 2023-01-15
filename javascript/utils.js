import { inputTags, textInputTypes } from './enums'
import ActiveElement from './active_element'

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
  const focusElement = element || ActiveElement.element
  if (focusElement && focusElement.focus) focusElement.focus()
}

// Dispatches an event on the passed element
//
// * element - the element
// * name - the name of the event
// * detail - the event detail
//
const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true, detail }
  const event = new CustomEvent(name, init)
  element.dispatchEvent(event)
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

// Accepts an xPath query and returns all matching elements in the DOM
//
const xpathToElementArray = (xpath, reverse = false) => {
  const snapshotList = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )
  const snapshots = []

  for (let i = 0; i < snapshotList.snapshotLength; i++) {
    snapshots.push(snapshotList.snapshotItem(i))
  }

  return reverse ? snapshots.reverse() : snapshots
}

// Return an array with the class names to be used
//
// * names - could be a string or an array of strings for multiple classes.
//
const getClassNames = names => Array.from(names).flat()

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

// convert string to kebab-case
// most other implementations (lodash) are focused on camelCase to kebab-case
// instead, this uses word token boundaries to produce readable URL slugs and keys
// this implementation will not support Emoji or other non-ASCII characters
//
const kebabize = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase()
})

function createCompounder (callback) {
  return function (str) {
    return words(str).reduce(callback, '')
  }
}

const words = str => {
  str = str == null ? '' : str
  return str.match(/([A-Z]{2,}|[0-9]+|[A-Z]?[a-z]+|[A-Z])/g) || []
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

function debounce (fn, delay = 250) {
  let timer
  return (...args) => {
    const callback = () => fn.apply(this, args)
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback, delay)
  }
}

function handleErrors (response) {
  if (!response.ok) throw Error(response.statusText)
  return response
}

function safeScalar (val) {
  if (
    val !== undefined &&
    !['string', 'number', 'boolean'].includes(typeof val)
  )
    console.warn(
      `Operation expects a string, number or boolean, but got ${val} (${typeof val})`
    )
  return val != null ? val : ''
}

function safeString (str) {
  if (str !== undefined && typeof str !== 'string')
    console.warn(`Operation expects a string, but got ${str} (${typeof str})`)

  return str != null ? String(str) : ''
}

function safeArray (arr) {
  if (arr !== undefined && !Array.isArray(arr))
    console.warn(`Operation expects an array, but got ${arr} (${typeof arr})`)
  return arr != null ? Array.from(arr) : []
}

function safeObject (obj) {
  if (obj !== undefined && typeof obj !== 'object')
    console.warn(`Operation expects an object, but got ${obj} (${typeof obj})`)
  return obj != null ? Object(obj) : {}
}

function safeStringOrArray (elem) {
  if (elem !== undefined && !Array.isArray(elem) && typeof elem !== 'string')
    console.warn(`Operation expects an Array or a String, but got ${elem} (${typeof elem})`)

  return elem == null ? '' : Array.isArray(elem) ? Array.from(elem) : String(elem)
}

function fragmentToString (fragment) {
  return new XMLSerializer().serializeToString(fragment)
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
  xpathToElementArray,
  getClassNames,
  processElements,
  operate,
  before,
  after,
  debounce,
  handleErrors,
  graciouslyFetch,
  kebabize,
  safeScalar,
  safeString,
  safeArray,
  safeObject,
  safeStringOrArray,
  fragmentToString
}
