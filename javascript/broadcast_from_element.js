import morphdom from 'morphdom'
import { consumer } from './action_cable'

class BroadcastFromElement extends HTMLElement {
  constructor () {
    super()
    this.received = this.received.bind(this)
  }

  connectedCallback () {
    if (this.preview) return
    if (consumer) {
      this.channel = consumer.subscriptions.create(
        {
          channel: 'CableReady::Stream',
          identifier: this.getAttribute('identifier')
        },
        {
          received: this.received
        }
      )
    } else {
      console.error(
        'The `broadcast_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
      )
    }
  }

  received (data) {
    const template = document.createElement('template')
    fetch(
      this.hasAttribute('url') ? this.getAttribute('url') : window.location.href
    )
      .then(response => response.text())
      .then(html => {
        template.innerHTML = String(html).trim()
        morphdom(
          this,
          template.content.querySelector(
            `broadcast-from[identifier="${this.getAttribute('identifier')}"]`
          ),
          { childrenOnly: true }
        )
      })
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

if (!window.customElements.get('broadcast-from')) {
  window.customElements.define('broadcast-from', BroadcastFromElement)
}
