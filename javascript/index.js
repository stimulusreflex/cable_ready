import * as MorphCallbacks from './morph_callbacks'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'
import * as Utils from './utils'
import OperationStore, { addOperation, addOperations } from './operation_store'
import { perform, performAsync, initialize } from './cable_ready'
import './stream_from_element'

export { Utils, MorphCallbacks }

export default {
  perform,
  performAsync,
  shouldMorphCallbacks,
  didMorphCallbacks,
  initialize,
  addOperation,
  addOperations,
  get DOMOperations () {
    console.warn(
      'DEPRECATED: Please use `CableReady.operations.jazzHands = ...` instead of `CableReady.DOMOperations.jazzHands = ...`'
    )
    return OperationStore.all
  },
  get operations () {
    return OperationStore.all
  }
}
