import packageInfo from '../package.json'
import { perform, performAsync } from './cable_ready'
import { defineElements } from './elements'
import { shouldMorphCallbacks, didMorphCallbacks } from './morph_callbacks'

import * as Plugins from './plugins'

// TODO: Remove this in v6
// Kicking the can down the road for now
import morphdom from 'morphdom'
Plugins.register('morphdom', morphdom)

import * as MorphCallbacks from './morph_callbacks'
import * as Utils from './utils'

import OperationStore, { addOperation, addOperations } from './operation_store'
import CableReadyElement from './elements/cable_ready_element'
import StreamFromElement from './elements/stream_from_element'
import UpdatesForElement from './elements/updates_for_element'
import SubscribingElement from './elements/subscribing_element'
import CableConsumer from './cable_consumer'

const initialize = (initializeOptions = {}) => {
  const { consumer, onMissingElement, plugins } = initializeOptions

  if (consumer) {
    CableConsumer.setConsumer(consumer)
  } else {
    console.error(
      'CableReady requires a reference to your Action Cable `consumer` for its helpers to function.\nEnsure that you have imported the `CableReady` package as well as `consumer` from your `channels` folder, then call `CableReady.initialize({ consumer })`.'
    )
  }

  if (onMissingElement) MissingElement.set(onMissingElement)

  if (plugins)
    Object.keys(plugins).forEach(plugin =>
      Plugins.register(plugin, plugins[plugin])
    )

  defineElements()
}

export {
  Utils,
  MorphCallbacks,
  Plugins,
  CableReadyElement,
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
  registerPlugin: Plugins.register,
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
