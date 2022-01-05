import { version } from '../package.json'
import * as MorphCallbacks from './morph_callbacks'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'
import * as Utils from './utils'
import OperationStore, { addOperation, addOperations } from './operation_store'
import { perform, performAsync } from './cable_ready'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'
import CableConsumer from './cable_consumer'

const initialize = (initializeOptions = {}) => {
  const { consumer } = initializeOptions

  if (consumer) {
    CableConsumer.setConsumer(consumer)
  } else {
    console.error(
      'CableReady requires a reference to your Action Cable `consumer` for its helpers to function.\nEnsure that you have imported the `CableReady` package as well as `consumer` from your `channels` folder, then call `CableReady.initialize({ consumer })`.'
    )
  }

  if (!customElements.get('stream-from')) {
    customElements.define('stream-from', StreamFromElement)
  }

  if (!customElements.get('updates-for')) {
    customElements.define('updates-for', UpdatesForElement)
  }
}

export {
  Utils,
  MorphCallbacks,
  StreamFromElement,
  UpdatesForElement,
  SubscribingElement
}

export default {
  perform,
  performAsync,
  shouldMorphCallbacks,
  didMorphCallbacks,
  initialize,
  addOperation,
  addOperations,
  version,
  get DOMOperations () {
    console.warn(
      'DEPRECATED: Please use `CableReady.operations` instead of `CableReady.DOMOperations`'
    )
    return OperationStore.all
  },
  get operations () {
    return OperationStore.all
  },
  get consumer () {
    return CableConsumer.getConsumer()
  }
}
