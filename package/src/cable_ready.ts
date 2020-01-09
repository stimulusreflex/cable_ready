import { xpathToElement } from './constants';
import { DOMOperations } from './operations';
import { Operation } from './types';

const perform = (operations: Operation) => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        try {
          const detail = entries[i]
          if (detail.selector) {
            detail.element = detail.xpath
              ? xpathToElement(detail.selector)
            : document.querySelector(detail.selector)
          } else {
            detail.element = document
          }
          DOMOperations[name](detail)
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`)
        }
      }
    }
  }
}

export default { perform }
