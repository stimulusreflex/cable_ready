window.CableReady = window.CableReady || {}

export const state = {
  get activeElement () {
    return window.CableReady.activeElement
  },

  set activeElement (value) {
    window.CableReady.activeElement = value
  }
}

const textInputTagNames = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true
}

const textInputTypes = {
  'datetime-local': true,
  'select-multiple': true,
  'select-one': true,
  color: true,
  date: true,
  datetime: true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  textarea: true,
  time: true,
  url: true,
  week: true
}

// Indicates if the passed element is considered a text input.
//
export const isTextInput = element => {
  return textInputTagNames[element.tagName] && textInputTypes[element.type]
}

// Dispatches an event on the passed element
//
// * element - the element
// * name - the name of the event
// * detail - the event detail
//
export const dispatch = (element, name, detail = {}) => {
  const init = { bubbles: true, cancelable: true }
  const evt = new Event(name, init)
  evt.detail = detail
  element.dispatchEvent(evt)
}
