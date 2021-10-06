import CableReady from '.'
import actionCable from './action_cable'

class StreamFromElement extends HTMLElement {
  async connectedCallback () {
    if (this.preview) return
    const consumer = await actionCable.getConsumer()
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
        'The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
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

if (!customElements.get('stream-from'))
  customElements.define('stream-from', StreamFromElement)
