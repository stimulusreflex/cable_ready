import morphdom from 'morphdom'
import { shouldMorph } from './morph_callbacks'
import activeElement from './active_element'
import actionCable from './action_cable'
import { debounce, assignFocus, dispatch, handleErrors } from './utils'

const template = `
<style>
  :host {
    display: block;
  }
</style>
<slot></slot>
`

function url (ele) {
  return ele.hasAttribute('url') ? ele.getAttribute('url') : location.href
}

class UpdatesForElement extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = template
  }

  async connectedCallback () {
    if (this.preview) return
    this.update = debounce(this.update.bind(this), this.debounce)

    const consumer = await actionCable.getConsumer()
    if (consumer) {
      this.channel = consumer.subscriptions.create(
        {
          channel: 'CableReady::Stream',
          identifier: this.getAttribute('identifier')
        },
        {
          received: this.update
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

  async update () {
    const identifier = this.getAttribute('identifier')
    const query = `updates-for[identifier="${identifier}"]`
    const blocks = document.querySelectorAll(query)
    if (blocks[0] !== this) return

    const html = {}
    const template = document.createElement('template')

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].setAttribute('updating', 'updating')

      if (!html.hasOwnProperty(url(blocks[i]))) {
        const response = await fetch(url(blocks[i]))
          .then(handleErrors)
          .catch(e => console.error(`Could not fetch ${url(blocks[i])}`))
        if (response === undefined) return
        html[url(blocks[i])] = await response.text()
      }

      template.innerHTML = String(html[url(blocks[i])]).trim()
      const fragments = template.content.querySelectorAll(query)
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
        onBeforeElUpdated: shouldMorph(operation),
        onElUpdated: _ => {
          blocks[i].removeAttribute('updating')
          dispatch(blocks[i], 'cable-ready:after-update', operation)
          assignFocus(operation.focusSelector)
        }
      })
    }
  }

  get preview () {
    return (
      document.documentElement.hasAttribute('data-turbolinks-preview') ||
      document.documentElement.hasAttribute('data-turbo-preview')
    )
  }

  get debounce () {
    return this.hasAttribute('debounce')
      ? parseInt(this.getAttribute('debounce'))
      : 20
  }
}

if (!customElements.get('updates-for'))
  customElements.define('updates-for', UpdatesForElement)
