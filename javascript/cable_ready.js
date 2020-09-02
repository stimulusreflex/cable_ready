import cookies from './operations/cookies'
import events from './operations/events'
import mutations from './operations/mutations'
import navigations from './operations/navigations'
import notifications from './operations/notifications'
import { isTextInput } from './util'

const DOMOperations = {
  ...cookies,
  ...events,
  ...mutations,
  ...navigations,
  ...notifications
}

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

const perform = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        const detail = entries[i]
        try {
          if (detail.selector) {
            detail.element = detail.xpath
              ? xpathToElement(detail.selector)
              : document.querySelector(detail.selector)
          } else {
            detail.element = document
          }
          if (detail.element || options.emitMissingElementWarnings) {
            DOMOperations[name](detail)
          }
        } catch (e) {
          if (detail.element)
            console.log(`CableReady detected an error in ${name}! ${e.message}`)
          else
            console.log(
              `CableReady ${name} failed due to missing DOM element for selector: '${detail.selector}'`
            )
        }
      }
    }
  }
}

const performAsync = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(perform(operations, options))
    } catch (err) {
      reject(err)
    }
  })
}

export default { perform, performAsync, isTextInput, DOMOperations }
