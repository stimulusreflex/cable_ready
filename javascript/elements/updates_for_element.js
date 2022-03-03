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

  async update (data) {
    const blocks = Array.from(
      document.querySelectorAll(this.query),
      element => new Block(element)
    )

    // first updates-for element in the DOM *at any given moment* updates all of the others
    if (blocks[0].element !== this) return

    // hold a reference to the active element so that it can be restored after the morph
    ActiveElement.set(document.activeElement)

    // store all retrieved HTML in an object keyed by URL to minimize fetch calls
    this.html = {}

    const uniqueUrls = [...new Set(blocks.map(block => block.url))]

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

    // track current block index for each URL; referred to as fragments
    this.index = {}

    blocks.forEach(block => {
      // if the block's URL is not in the index, initialize it to 0; otherwise, increment it
      this.index.hasOwnProperty(block.url)
        ? this.index[block.url]++
        : (this.index[block.url] = 0)

      block.process(data, this.html, this.index)
    })
  }

  get query () {
    return `updates-for[identifier="${this.identifier}"]`
  }

  get identifier () {
    return this.getAttribute('identifier')
  }

  get debounce () {
    return this.hasAttribute('debounce')
      ? parseInt(this.getAttribute('debounce'))
      : 20
  }
}

class Block {
  constructor (element) {
    this.element = element
  }

  async process (data, html, index) {
    // with the index incremented, we can now safely bail - before a fetch - if there's no work to be done
    if (!this.shouldUpdate(data)) return

    const blockIndex = index[this.url]
    const template = document.createElement('template')
    this.element.setAttribute('updating', 'updating')

    template.innerHTML = String(html[this.url]).trim()

    await this.resolveTurboFrames(template.content)

    const fragments = template.content.querySelectorAll(this.query)

    if (fragments.length <= blockIndex) {
      console.warn(
        `Update aborted due to insufficient number of elements. The offending url is ${this.url}.`
      )
      return
    }

    const operation = {
      element: this.element,
      html: fragments[blockIndex],
      permanentAttributeName: 'data-ignore-updates'
    }

    dispatch(this.element, 'cable-ready:before-update', operation)
    morphdom(this.element, fragments[blockIndex], {
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

  shouldUpdate (data) {
    // if everything that could prevent an update is false, update this block
    return !this.ignoresInnerUpdates && this.hasChangesSelectedForUpdate(data)
  }

  hasChangesSelectedForUpdate (data) {
    // if there's an only attribute, only update if at least one of the attributes changed is in the allow list
    const only = this.element.getAttribute('only')

    return !(
      only &&
      data.changed &&
      !only.split(' ').some(attribute => data.changed.includes(attribute))
    )
  }

  get ignoresInnerUpdates () {
    // don't update during a Reflex or Turbolinks redraw
    return (
      this.element.hasAttribute('ignore-inner-updates') &&
      this.element.hasAttribute('performing-inner-update')
    )
  }

  get url () {
    return this.element.hasAttribute('url')
      ? this.element.getAttribute('url')
      : location.href
  }

  get identifier () {
    return this.element.identifier
  }

  get query () {
    return this.element.query
  }
}
