// constants.ts

export const dispatch = (element: Element, name: string, detail = {}) => {
  const init = { bubbles: true, cancelable: true }
  const evt = new Event(name, init)
  // Property 'detail' does not exist on type 'Event'??
  evt.detail = detail
  element.dispatchEvent(evt)
}

export const xpathToElement = (xpath: string) => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

// SEE: https://github.com/patrick-steele-idem/morphdom#morphdomfromnode-tonode-options--node
export const shouldMorph = (permanentAttributeName: string) => (fromEl: HTMLElement, toEl: HTMLElement) => {
  // Skip nodes that are equal:
  // https://github.com/patrick-steele-idem/morphdom#can-i-make-morphdom-blaze-through-the-dom-tree-even-faster-yes
  if (fromEl.isEqualNode(toEl)) return false
  if (!permanentAttributeName) return true
  return !fromEl.closest(`[${permanentAttributeName}]`)
}
