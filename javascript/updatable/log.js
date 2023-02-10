const request = (data, blocks) => {
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
  const duration = new Date() - timestamp
  console.log(
    `\u274C Updatable request canceled after ${duration}ms: ${reason}`
  )
}

const response = (timestamp, element, urls) => {
  const duration = new Date() - timestamp
  console.log(`\u2193 Updatable response: All URLs fetched in ${duration}ms`, {
    element,
    urls
  })
}

const morphStart = (timestamp, element) => {
  const duration = new Date() - timestamp
  console.log(`\u21BB Updatable morph: starting after ${duration}ms`, {
    element
  })
}

const morphEnd = (timestamp, element) => {
  const duration = new Date() - timestamp
  console.log(`\u21BA Updatable morph: completed after ${duration}ms`, {
    element
  })
}

export default { request, cancel, response, morphStart, morphEnd }
