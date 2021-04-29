import { verifyNotMutable, verifyNotPermanent } from './morph_callbacks'
import { xpathToElement } from './utils'
import activeElement from './active_element'
import DOMOperations from './operations'
import actionCable from './action_cable'
import './stream_from_element'

export const shouldMorphCallbacks = [verifyNotMutable, verifyNotPermanent]
export const didMorphCallbacks = []

const perform = (
  operations,
  options = { emitMissingElementWarnings: true }
) => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name]
      for (let i = 0; i < entries.length; i++) {
        const operation = entries[i]
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
            activeElement.set(document.activeElement)
            DOMOperations[name](operation)
          }
        } catch (e) {
          if (operation.element) {
            console.error(
              `CableReady detected an error in ${name}: ${e.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`
            )
            console.error(e)
          } else {
            console.log(
              `CableReady ${name} failed due to missing DOM element for selector: '${operation.selector}'`
            )
          }
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

const initialize = (initializeOptions = {}) => {
  const { consumer } = initializeOptions
  actionCable.setConsumer(consumer)
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.audio && document.body.hasAttribute('data-unlock-audio')) {
    document.audio = new Audio(
      'data:audio/mpeg;base64,//OExAAAAAAAAAAAAEluZm8AAAAHAAAABAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/AAAAAAAAAAAAAAAAAAAAAAAAAAAAJAa/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//MUxAAAAANIAAAAAExBTUUzLjk2LjFV//MUxAsAAANIAAAAAFVVVVVVVVVVVVVV//MUxBYAAANIAAAAAFVVVVVVVVVVVVVV//MUxCEAAANIAAAAAFVVVVVVVVVVVVVV'
    )
    const unlockAudio = () => {
      document.body.removeEventListener('click', unlockAudio)
      document.body.removeEventListener('touchstart', unlockAudio)
      document.audio
        .play()
        .then(() => {})
        .catch(() => {})
    }
    document.body.addEventListener('click', unlockAudio)
    document.body.addEventListener('touchstart', unlockAudio)
  }
})

export default {
  perform,
  performAsync,
  DOMOperations,
  shouldMorphCallbacks,
  didMorphCallbacks,
  initialize
}
