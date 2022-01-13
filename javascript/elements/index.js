import CableConsumer from '../cable_consumer'

import StreamFromElement from './stream_from_element'
import UpdatesForElement from './updates_for_element'

import { registerInnerUpdates } from '../updatable/inner_updates_compat'

const initialize = (initializeOptions = {}) => {
  const { consumer } = initializeOptions

  registerInnerUpdates()

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

export { initialize }
