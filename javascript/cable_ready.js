import { xpathToElement, dispatch } from './utils'

import ActiveElement from './active_element'
import OperationStore from './operation_store'

const perform = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  const batches = {}
  operations.forEach(operation => {
    if (!!operation.batch)
      batches[operation.batch] = batches[operation.batch]
        ? ++batches[operation.batch]
        : 1
  })
  operations.forEach(operation => {
    const name = operation.operation
    try {
      if (operation.selector) {
        operation.element = operation.xpath
          ? xpathToElement(operation.selector)
          : document[
              operation.selectAll ? 'querySelectorAll' : 'querySelector'
            ](operation.selector)
      } else {
        operation.element = document
      }
      if (operation.element || options.emitMissingElementWarnings) {
        ActiveElement.set(document.activeElement)
        const cableReadyOperation = OperationStore.all[name]

        if (cableReadyOperation) {
          cableReadyOperation(operation)
          if (!!operation.batch && --batches[operation.batch] === 0)
            dispatch(document, 'cable-ready:batch-complete', {
              batch: operation.batch
            })
        } else {
          console.error(
            `CableReady couldn't find the "${name}" operation. Make sure you use the camelized form when calling an operation method.`
          )
        }
      }
    } catch (e) {
      if (operation.element) {
        console.error(
          `CableReady detected an error in ${name || 'operation'}: ${
            e.message
          }. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`
        )
        console.error(e)
      } else {
        console.warn(
          `CableReady ${name ||
            'operation'} failed due to missing DOM element for selector: '${
            operation.selector
          }'`
        )
      }
    }
  })
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

export { perform, performAsync }
