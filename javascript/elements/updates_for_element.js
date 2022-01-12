import morphdom from 'morphdom'

import SubscribingElement from './subscribing_element'

import { shouldMorph } from '../morph_callbacks'
import { debounce, assignFocus, dispatch, graciouslyFetch } from '../utils'

import ActiveElement from '../active_element'
import CableConsumer from '../cable_consumer'

const template = `
<style>
  :host {
    display: block;
  }
</style>
<slot></slot>
`

function url (element) {
  return element.hasAttribute('url')
    ? element.getAttribute('url')
    : location.href
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

    const consumer = await CableConsumer.getConsumer()

    if (consumer) {
      this.createSubscription(consumer, 'CableReady::Stream', this.update)
    } else {
      console.error(
        'The `updates-for` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.'
      )
    }
  }

  shouldUpdate (data) {
    return (
      !this.ignoringInnerUpdates &&
      this.hasChangesSelectedForUpdate(data) &&
      this.blocks[0] === this
    )
  }

  update (data) {
    ActiveElement.set(document.activeElement)

    if (!this.shouldUpdate(data)) {
      return
    }

    this.html = {}

    this.blocks.forEach(this.processBlock.bind(this))
  }

  async processBlock (block, index) {
    const template = document.createElement('template')
    block.setAttribute('updating', 'updating')

    if (!this.html.hasOwnProperty(url(block))) {
      const response = await graciouslyFetch(url(block), {
        'X-Cable-Ready': 'update'
      })
      this.html[url(block)] = await response.text()
    }

    template.innerHTML = String(this.html[url(block)]).trim()

    await this.resolveTurboFrames(template.content)

    const fragments = template.content.querySelectorAll(this.query)

    if (fragments.length <= index) {
      console.warn('Update aborted due to mismatched number of elements')
      return
    }

    const operation = {
      element: block,
      html: fragments[index],
      permanentAttributeName: 'data-ignore-updates'
    }

    dispatch(block, 'cable-ready:before-update', operation)
    morphdom(block, fragments[index], {
      childrenOnly: true,
      onBeforeElUpdated: shouldMorph(operation),
      onElUpdated: _ => {
        block.removeAttribute('updating')
        dispatch(block, 'cable-ready:after-update', operation)
        assignFocus(operation.focusSelector)
      }
    })
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

  hasChangesSelectedForUpdate (data) {
    const only = this.getAttribute('only')

    return !(
      only &&
      data.changed &&
      !only.split(' ').some(attribute => data.changed.includes(attribute))
    )
  }

  get query () {
    return `updates-for[identifier="${this.identifier}"]`
  }

  get blocks () {
    return document.querySelectorAll(this.query)
  }

  get debounce () {
    return this.hasAttribute('debounce')
      ? parseInt(this.getAttribute('debounce'))
      : 20
  }

  get ignoringInnerUpdates () {
    return (
      this.hasAttribute('ignore-inner-updates') &&
      this.hasAttribute('performing-inner-update')
    )
  }
}
