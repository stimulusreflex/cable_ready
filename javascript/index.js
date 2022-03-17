import packageInfo from '../package.json'
import { perform, performAsync } from './cable_ready'
import { initialize } from './elements'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'

import * as MorphCallbacks from './morph_callbacks'
import * as Utils from './utils'

import OperationStore, { addOperation, addOperations } from './operation_store'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'
import CableConsumer from './cable_consumer'

export {
  Utils,
  MorphCallbacks,
  StreamFromElement,
  UpdatesForElement,
  SubscribingElement
}

const global = {
  perform,
  performAsync,
  shouldMorphCallbacks,
  didMorphCallbacks,
  initialize,
  addOperation,
  addOperations,
  version: packageInfo.version,
  cable: CableConsumer,
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
    return CableConsumer.consumer
  }
}

window.CableReady = global

export default global
