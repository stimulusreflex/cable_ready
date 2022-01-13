import { perform } from '../cable_ready'
import SubscribingElement from './subscribing_element'
import CableConsumer from '../cable_consumer'

export default class StreamFromElement extends SubscribingElement {
  async connectedCallback () {
    if (this.preview) return

    const consumer = await CableConsumer.getConsumer()

    if (consumer) {
      this.createSubscription(
        consumer,
        'CableReady::Stream',
        this.performOperations
      )
    } else {
      console.error(
        'The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
      )
    }
  }

  performOperations (data) {
    if (data.cableReady) perform(data.operations)
  }
}
