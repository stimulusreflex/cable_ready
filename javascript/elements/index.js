import CableConsumer from '../cable_consumer'
import MissingElement from '../missing_element'
import CableReadyElement from './cable_ready_element'
import StreamFromElement from './stream_from_element'
import UpdatesForElement from './updates_for_element'

import { registerInnerUpdates } from '../updatable/inner_updates_compat'

const initialize = (initializeOptions = {}) => {
  const { consumer, onMissingElement } = initializeOptions

  registerInnerUpdates()

  if (consumer) {
    CableConsumer.setConsumer(consumer)
  } else {
    console.error(
      'CableReady requires a reference to your Action Cable `consumer` for its helpers to function.\nEnsure that you have imported the `CableReady` package as well as `consumer` from your `channels` folder, then call `CableReady.initialize({ consumer })`.'
    )
  }

  if (onMissingElement) MissingElement.set(onMissingElement)

  CableReadyElement.define()
  StreamFromElement.define()
  UpdatesForElement.define()
}

export { initialize }
