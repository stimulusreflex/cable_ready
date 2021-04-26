import CableReady from 'cable_ready'
import { consumer } from './action_cable'

class StreamFromElement extends HTMLElement {
  connectedCallback () {
    if (this.preview) return
    if (consumer) {
      this.channel = consumer.subscriptions.create(
        {
          channel: 'CableReady::Stream',
          identifier: this.getAttribute('identifier')
        },
        {
          received (data) {
            if (data.cableReady) CableReady.perform(data.operations)
          }
        }
      )
    } else {
      console.error(
        `The stream_from helper cannot connect without an ActionCable consumer.\nPlease set 'CableReady.initialize({ consumer })' in your index.js.`
      )
    }
  }

  disconnectedCallback () {
    if (this.channel) this.channel.unsubscribe()
  }

  get preview () {
    return (
      document.documentElement.hasAttribute('data-turbolinks-preview') ||
      document.documentElement.hasAttribute('data-turbo-preview')
    )
  }
}

customElements.define('stream-from', StreamFromElement)
