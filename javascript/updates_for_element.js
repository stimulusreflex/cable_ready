import morphdom from 'morphdom'
import { shouldMorph } from './morph_callbacks'
import activeElement from './active_element'
import actionCable from './action_cable'
import { assignFocus, dispatch } from './utils'

class UpdatesForElement extends HTMLElement {
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
          received: () => {
            const identifier = this.getAttribute('identifier')
            const query = `updates-for[identifier="${identifier}"]`
            const blocks = document.querySelectorAll(query)
            if (blocks[0] !== this) return

            const template = document.createElement('template')
            fetch(
              this.hasAttribute('url')
                ? this.getAttribute('url')
                : window.location.href
            )
              .then(response => response.text())
              .then(html => {
                template.innerHTML = String(html).trim()
                const fragments = template.content.querySelectorAll(query)
                for (let i = 0; i < blocks.length; i++) {
                  activeElement.set(document.activeElement)
                  const operation = {
                    element: blocks[i],
                    html: fragments[i],
                    permanentAttributeName: 'data-ignore-updates',
                    focusSelector: null
                  }
                  dispatch(blocks[i], 'cable-ready:before-update', operation)
                  morphdom(blocks[i], fragments[i], {
                    childrenOnly: true,
                    onBeforeElUpdated: shouldMorph(operation)
                  })
                  dispatch(blocks[i], 'cable-ready:after-update', operation)
                  assignFocus(operation.focusSelector)
                }
              })
          }
        }
      )
    } else {
      console.error(
        'The `updates-for` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
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

if (!window.customElements.get('updates-for')) {
  window.customElements.define('updates-for', UpdatesForElement)
}
