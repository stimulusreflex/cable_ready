import morphdom from 'morphdom'

import packageInfo from '../package.json'
import { perform, performAsync } from './cable_ready'
import { defineElements } from './elements'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'

import * as MorphCallbacks from './morph_callbacks'
import * as Utils from './utils'

import OperationStore, { addOperation, addOperations } from './operation_store'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'
import CableConsumer from './cable_consumer'
import Debug from './debug'

const initialize = (initializeOptions = {}) => {
  const { consumer, onMissingElement, debug } = initializeOptions

  Debug.set(!!debug)

  if (consumer) {
    CableConsumer.setConsumer(consumer)
  } else {
    console.error(
      'CableReady requires a reference to your Action Cable `consumer` for its helpers to function.\nEnsure that you have imported the `CableReady` package as well as `consumer` from your `channels` folder, then call `CableReady.initialize({ consumer })`.'
    )
  }

  if (onMissingElement) {
    MissingElement.set(onMissingElement)
  }

  defineElements()
}

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
