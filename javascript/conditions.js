import { mutableTags } from './enums'
import { isTextInput } from './utils'
import { activeElement } from './cable_ready'

export const verifyNotMutable = (detail, fromEl, toEl) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (!mutableTags[fromEl.tagName] && fromEl.isEqualNode(toEl)) return false
  return true
}

export const verifyNotPermanent = (detail, fromEl, toEl) => {
  const { permanentAttributeName } = detail
  if (!permanentAttributeName) return true

  const permanent = fromEl.closest(`[${permanentAttributeName}]`)

  // only morph attributes on the active non-permanent text input
  if (!permanent && isTextInput(fromEl) && fromEl === activeElement) {
    const ignore = { value: true }
    Array.from(toEl.attributes).forEach(attribute => {
      if (!ignore[attribute.name])
        fromEl.setAttribute(attribute.name, attribute.value)
    })
    return false
  }

  return !permanent
}
