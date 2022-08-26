import { xpathToElement, xpathToElementArray, dispatch } from './utils'
import ActiveElement from './active_element'
import OperationStore from './operation_store'
import MissingElement from './missing_element'

const perform = (
  operations,
  options = { onMissingElement: MissingElement.behavior }
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
        if (operation.xpath) {
          operation.element = operation.selectAll
            ? xpathToElementArray(operation.selector)
            : xpathToElement(operation.selector)
        } else {
          operation.element = operation.selectAll
            ? document.querySelectorAll(operation.selector)
            : document.querySelector(operation.selector)
        }
      } else {
        operation.element = document
      }
      if (operation.element || options.onMissingElement !== 'ignore') {
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
        const warning = `CableReady ${name ||
          ''} operation failed due to missing DOM element for selector: '${
          operation.selector
        }'`
        switch (options.onMissingElement) {
          case 'ignore':
            break
          case 'event':
            dispatch(document, 'cable-ready:missing-element', {
              warning,
              operation
            })
            break
          case 'exception':
            throw warning
          default:
            console.warn(warning)
        }
      }
    }
  })
}

const performAsync = (
  operations,
  options = { onMissingElement: MissingElement.behavior }
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
