import { mutableTags } from './enums'
import { isTextInput } from './utils'
import ActiveElement from './active_element'

// Indicates whether or not we should morph an element via onBeforeElUpdated callback
// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
//
const shouldMorph = operation => (fromEl, toEl) => {
  return !shouldMorphCallbacks
    .map(callback => {
      return typeof callback === 'function'
        ? callback(operation, fromEl, toEl)
        : true
    })
    .includes(false)
}

// Execute any pluggable functions that modify elements after morphing via onElUpdated callback
//
const didMorph = operation => el => {
  didMorphCallbacks.forEach(callback => {
    if (typeof callback === 'function') callback(operation, el)
  })
}

const verifyNotMutable = (detail, fromEl, toEl) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (!mutableTags[fromEl.tagName] && fromEl.isEqualNode(toEl)) return false
  return true
}

const verifyNotContentEditable = (detail, fromEl, toEl) => {
  if (fromEl === ActiveElement.element && fromEl.isContentEditable) return false
  return true
}

const verifyNotPermanent = (detail, fromEl, toEl) => {
  const { permanentAttributeName } = detail
  if (!permanentAttributeName) return true

  const permanent = fromEl.closest(`[${permanentAttributeName}]`)

  // only morph attributes on the active non-permanent text input
  if (!permanent && fromEl === ActiveElement.element && isTextInput(fromEl)) {
    const ignore = { value: true }
    Array.from(toEl.attributes).forEach(attribute => {
      if (!ignore[attribute.name])
        fromEl.setAttribute(attribute.name, attribute.value)
    })
    return false
  }

  return !permanent
}

const shouldMorphCallbacks = [
  verifyNotMutable,
  verifyNotPermanent,
  verifyNotContentEditable
]
const didMorphCallbacks = []

export {
  shouldMorphCallbacks,
  didMorphCallbacks,
  shouldMorph,
  didMorph,
  verifyNotMutable,
  verifyNotContentEditable,
  verifyNotPermanent
}
