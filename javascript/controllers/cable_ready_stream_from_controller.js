import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class CableReadyStreamFromController extends Controller {
  static consumer = null

  static values = {
    signedStreamName: String
  }

  connect () {
    CableReadyStreamFromController.consumer.subscriptions.create(
      {
        channel: 'CableReadyChannel',
        signed_stream_name: this.signedStreamNameValue
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
        }
      }
    )
  }
}
