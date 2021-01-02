import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class CableReadyStreamFromController extends Controller {

  static values = {
    signedStreamName: String
  }

  connect () {
    if(this.application.consumer) {
      this.application.consumer.subscriptions.create(
        {
          channel: 'CableReady::CableReadyChannel',
          signed_stream_name: this.signedStreamNameValue
        },
        {
          received (data) {
            if (data.cableReady) CableReady.perform(data.operations)
          }
        }
      )
    } else {
      console.error("cable-ready-stream-from-controller cannot connect due to missing consumer");
    }

  }
}
