import morphdom from 'morphdom'

import SubscribingElement from './subscribing_element'

import { shouldMorph } from '../morph_callbacks'
import {
  debounce,
  assignFocus,
  dispatch,
  graciouslyFetch,
  sha256
} from '../utils'

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
      this.blocks[0].element === this
    )
  }

  async update (data) {
    ActiveElement.set(document.activeElement)

    if (!this.shouldUpdate(data)) {
      return
    }

    this.html = {}

    const uniqueUrls = [...new Set(this.blocks.map(block => block.url))]

    await Promise.all(
      uniqueUrls.map(async url => {
        if (!this.html.hasOwnProperty(url)) {
          const response = await graciouslyFetch(url, {
            'X-Cable-Ready': 'update'
          })
          this.html[url] = await response.text()
        }
      })
    )

    this.blocks.forEach((block, index) => {
      block.process(index, this.html)
    })
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
    return Array.from(
      document.querySelectorAll(this.query),
      element => new Block(element)
    )
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

class Block {
  constructor (element) {
    this.element = element
  }

  async process (index, html) {
    const template = document.createElement('template')
    this.element.setAttribute('updating', 'updating')

    template.innerHTML = String(html[this.url]).trim()

    await this.resolveTurboFrames(template.content)

    const fragments = template.content.querySelectorAll(this.element.query)

    if (fragments.length <= index) {
      console.warn('Update aborted due to mismatched number of elements')
      return
    }

    const operation = {
      element: this.element,
      html: fragments[index],
      permanentAttributeName: 'data-ignore-updates'
    }

    dispatch(this.element, 'cable-ready:before-update', operation)
    morphdom(this.element, fragments[index], {
      childrenOnly: true,
      onBeforeElUpdated: shouldMorph(operation),
      onElUpdated: _ => {
        this.element.removeAttribute('updating')
        dispatch(this.element, 'cable-ready:after-update', operation)
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

  get url () {
    return this.element.hasAttribute('url')
      ? this.element.getAttribute('url')
      : location.href
  }

  get identifier () {
    return this.element.getAttribute('identifier')
  }
}
