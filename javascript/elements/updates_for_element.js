import morphdom from 'morphdom'

import CableReady from '..'
import SubscribingElement from './subscribing_element'
import { shouldMorph } from '../morph_callbacks'
import activeElement from '../active_element'
import { debounce, assignFocus, dispatch, graciouslyFetch } from '../utils'

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

export default class UpdatesForElement extends SubscribingElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = template
  }

  async connectedCallback () {
    if (this.preview) return
    this.update = debounce(this.update.bind(this), this.debounce)

    const consumer = await CableReady.consumer
    if (consumer) {
      this.createSubscription(consumer, 'CableReady::Stream', this.update)
    } else {
      console.error(
        'The `updates-for` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
      )
    }
  }

  async update (data) {
    const identifier = this.getAttribute('identifier')
    const query = `updates-for[identifier="${identifier}"]`
    const blocks = document.querySelectorAll(query)
    if (blocks[0] !== this) return

    const only = this.getAttribute('only')
    if (
      only &&
      data.changed &&
      !only.split(' ').some(attribute => data.changed.includes(attribute))
    )
      return

    const html = {}
    const template = document.createElement('template')

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].setAttribute('updating', 'updating')

      if (!html.hasOwnProperty(url(blocks[i]))) {
        const response = await graciouslyFetch(url(blocks[i]), {
          'X-Cable-Ready': 'update'
        })
        html[url(blocks[i])] = await response.text()
      }

      template.innerHTML = String(html[url(blocks[i])]).trim()

      await this.resolveTurboFrames(template.content)

      const fragments = template.content.querySelectorAll(query)

      if (fragments.length <= i) {
        console.warn('Update aborted due to mismatched number of elements')
        return
      }

      activeElement.set(document.activeElement)
      const operation = {
        element: blocks[i],
        html: fragments[i],
        permanentAttributeName: 'data-ignore-updates'
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

  async resolveTurboFrames (documentFragment) {
    const reloadingTurboFrames = [
      ...documentFragment.querySelectorAll(
        'turbo-frame[src]:not([loading="lazy"])'
      )
    ]

    return Promise.all(
      reloadingTurboFrames.map(frame => {
        return new Promise(async resolve => {
          const frameResponse = await graciouslyFetch(
            frame.getAttribute('src'),
            {
              'Turbo-Frame': frame.id,
              'X-Cable-Ready': 'update'
            }
          )

          const frameTemplate = document.createElement('template')
          frameTemplate.innerHTML = await frameResponse.text()

          // recurse here to get all nested eager loaded frames
          await this.resolveTurboFrames(frameTemplate.content)

          documentFragment.querySelector(
            `turbo-frame#${frame.id}`
          ).innerHTML = String(
            frameTemplate.content.querySelector(`turbo-frame#${frame.id}`)
              .innerHTML
          ).trim()

          resolve()
        })
      })
    )
  }

  get debounce () {
    return this.hasAttribute('debounce')
      ? parseInt(this.getAttribute('debounce'))
      : 20
  }
}
