import * as MorphCallbacks from './morph_callbacks'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'
import * as Utils from './utils'
import OperationStore, { addOperation, addOperations } from './operation_store'
import { perform, performAsync, consumer } from './cable_ready'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'
import actionCable from './action_cable'

const initialize = (initializeOptions = {}) => {
  const { consumer } = initializeOptions
  actionCable.setConsumer(consumer)

  if (!customElements.get('stream-from'))
    customElements.define('stream-from', StreamFromElement)

  if (!customElements.get('updates-for'))
    customElements.define('updates-for', UpdatesForElement)
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
  consumer,
  addOperation,
  addOperations,
  get DOMOperations () {
    console.warn(
      'DEPRECATED: Please use `CableReady.operations` instead of `CableReady.DOMOperations`'
    )
    return OperationStore.all
  },
  get operations () {
    return OperationStore.all
  }
}
