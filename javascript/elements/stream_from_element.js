import { perform } from '../cable_ready'
import SubscribingElement from './subscribing_element'
import CableConsumer from '../cable_consumer'
import MissingElement from '../missing_element'

export default class StreamFromElement extends SubscribingElement {
  static get tagName () {
    return 'cable-ready-stream-from'
  }

  async connectedCallback () {
    if (this.preview) return

    const consumer = await CableConsumer.getConsumer()

    if (consumer) {
      this.createSubscription(
        consumer,
        'CableReady::Stream',
        this.performOperations.bind(this)
      )
    } else {
      console.error(
        'The `cable_ready_stream_from` helper cannot connect. You must initialize CableReady with an Action Cable consumer.'
      )
    }
  }

  performOperations (data) {
    if (data.cableReady)
      perform(data.operations, { onMissingElement: this.onMissingElement })
  }

  get onMissingElement () {
    const value = this.getAttribute('missing') || MissingElement.behavior

    // stream_from does not support raising exceptions on missing elements because there's no way to catch them
    if (['warn', 'ignore', 'event'].includes(value)) return value
    else {
      console.warn("Invalid 'missing' attribute. Defaulting to 'warn'.")
      return 'warn'
    }
  }
}
