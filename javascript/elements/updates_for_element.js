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

  update (data) {
    // first updates-for element in the DOM *at any given moment* updates all of the others
    if (this.blocks[0] !== this) return

    // hold a reference to the active element so that it can be restored after the morph
    ActiveElement.set(document.activeElement)

    // store all retrieved HTML in an object keyed by URL to minimize fetch calls
    this.html = {}

    // track current block index for each URL; referred to as fragments
    this.index = {}

    this.blocks.forEach(this.processBlock.bind(this, data))
  }

  async processBlock (data, block) {
    // memoize the block's URL to avoid unnecessary DOM interop
    const blockURL = url(block)

    // if the block's URL is not in the index, initialize it to 0; otherwise, increment it
    this.index.hasOwnProperty(blockURL)
      ? this.index[blockURL]++
      : (this.index[blockURL] = 0)

    // with the index incremented, we can now safely bail - before a fetch - if there's no work to be done
    if (!this.shouldUpdate(data, block)) return

    const index = this.index[blockURL]

    // we only want to fetch each URL once
    if (!this.html.hasOwnProperty(blockURL)) {
      const response = await graciouslyFetch(blockURL, {
        'X-Cable-Ready': 'update'
      })
      this.html[blockURL] = await response.text()
    }

    block.setAttribute('updating', 'updating')

    const template = document.createElement('template')
    template.innerHTML = String(this.html[blockURL]).trim()

    await this.resolveTurboFrames(template.content)

    const fragments = template.content.querySelectorAll(this.query)

    if (fragments.length <= index) {
      console.warn('Update aborted due to insufficient updates-for elements')
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

  shouldUpdate (data, block) {
    // if everything that could prevent an update is false, update this block
    return (
      !this.ignoresInnerUpdates(block) &&
      this.hasChangesSelectedForUpdate(data, block)
    )
  }

  hasChangesSelectedForUpdate (data, block) {
    // if there's an only attribute, only update if at least one of the attributes changed is in the allow list
    const only = block.getAttribute('only')

    return !(
      only &&
      data.changed &&
      !only.split(' ').some(attribute => data.changed.includes(attribute))
    )
  }

  ignoresInnerUpdates (block) {
    // don't update during a Reflex or Turbolinks redraw
    return (
      block.hasAttribute('ignore-inner-updates') &&
      block.hasAttribute('performing-inner-update')
    )
  }

  get blocks () {
    // memoize blocks to avoid unnecessary DOM traversal
    if (!this._blocks) this._blocks = document.querySelectorAll(this.query)

    return this._blocks
  }

  get query () {
    return `updates-for[identifier="${this.identifier}"]`
  }

  get debounce () {
    return this.hasAttribute('debounce')
      ? parseInt(this.getAttribute('debounce'))
      : 20
  }
}
