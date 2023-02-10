import Debug from '../debug'

const request = (data, blocks) => {
  if (Debug.disabled) return

  console.log(
    `\u2191 Updatable request affecting ${blocks.length} element(s): `,
    {
      elements: blocks.map(b => b.element),
      identifiers: blocks.map(b => b.element.getAttribute('identifier')),
      data
    }
  )
}

const cancel = (timestamp, reason) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  console.log(
    `\u274C Updatable request canceled after ${duration}ms: ${reason}`
  )
}

const response = (timestamp, element, urls) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  console.log(`\u2193 Updatable response: All URLs fetched in ${duration}ms`, {
    element,
    urls
  })
}

const morphStart = (timestamp, element) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  console.log(`\u21BB Updatable morph: starting after ${duration}ms`, {
    element
  })
}

const morphEnd = (timestamp, element) => {
  if (Debug.disabled) return

  const duration = new Date() - timestamp
  console.log(`\u21BA Updatable morph: completed after ${duration}ms`, {
    element
  })
}

export default { request, cancel, response, morphStart, morphEnd }
