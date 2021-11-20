import {
  consumer as CableReadyConsumer,
  perform as CableReadyPerform
} from '../cable_ready'
import SubscribingElement from './subscribing_element'

export default class StreamFromElement extends SubscribingElement {
  async connectedCallback () {
    if (this.preview) return
    const consumer = await CableReadyConsumer
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
    if (data.cableReady) CableReadyPerform(data.operations)
  }
}
