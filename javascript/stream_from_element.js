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
        'The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease set `CableReady.initialize({ consumer })` in your `index.js`.'
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

const customElement = window.customElements.get('stream-from')

if (customElement) {
  if (customElement !== StreamFromElement) {
    console.warn(
      'CableReady tried to register the HTML custom element `stream-from`, but `stream-from` is already registered and used by something else. Make sure that nothing else defines the custom element `stream-from`.'
    )
  } else {
    // CableReady has already registered the `stream-from` custom element and it's the right one
  }
} else {
  window.customElements.define('stream-from', StreamFromElement)
}
