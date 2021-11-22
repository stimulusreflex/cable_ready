import { version } from '../package.json'
import * as MorphCallbacks from './morph_callbacks'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'
import * as Utils from './utils'
import OperationStore, { addOperation, addOperations } from './operation_store'
import { perform, performAsync, initialize, consumer } from './cable_ready'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'

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
  version,
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
