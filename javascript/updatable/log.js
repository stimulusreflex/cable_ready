import Debug from '../debug'

const request = (data, blocks) => {
  if (Debug.disabled) return

  const message = `\u2191 Updatable request affecting ${blocks.length} element(s): `

  console.log(message, {
    elements: blocks.map(b => b.element),
    identifiers: blocks.map(b => b.element.getAttribute('identifier')),
    data
  })

  return message
}

const cancel = (timestamp, reason) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  const message = `\u274C Updatable request canceled after ${duration}ms: ${reason}`
  console.log(message)

  return message
}

const response = (timestamp, element, urls) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  const message = `\u2193 Updatable response: All URLs fetched in ${duration}ms`

  console.log(message, {
    element,
    urls
  })

  return message
}

const morphStart = (timestamp, element) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  const message = `\u21BB Updatable morph: starting after ${duration}ms`

  console.log(message, {
    element
  })

  return message
}

const morphEnd = (timestamp, element) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  const message = `\u21BA Updatable morph: completed after ${duration}ms`

  console.log(message, {
    element
  })

  return message
}

export default { request, cancel, response, morphStart, morphEnd }
