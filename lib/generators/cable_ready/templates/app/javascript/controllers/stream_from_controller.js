import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  static values = {
    identifier: String,
    sgid: String
  }

  connect () {
    if (this.application.consumer) {
      this.channel = this.application.consumer.subscriptions.create(
        {
          channel: 'CableReady::Stream',
          identifier: this.identifierValue,
          sgid: this.sgidValue
        },
        {
          received (data) {
            if (data.cableReady) CableReady.perform(data.operations)
          }
        }
      )
    } else {
      console.error(
        `"stream-from" Stimulus controller cannot connect without an ActionCable consumer.\nPlease set 'application.consumer = consumer' in your index.js to use CableReady streaming.`
      )
    }
  }

  disconnect () {
    this.channel.unsubscribe()
  }
}
