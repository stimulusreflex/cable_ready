import { html, fixture, assert } from '@open-wc/testing'

import CableReady from '..'
import morphdom from 'morphdom'

CableReady.registerPlugin('morphdom', morphdom)

describe('operations', () => {
  context('morph', () => {
    context('childrenOnly: false', () => {
      it('should add attributes to the morph target', async () => {
        const dom = await fixture(html(`<div id="morph">Pre-Operation</div>`))
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: `<div id="morph" data-muscles="sore">data-muscles will be set.</div>`
          }
        ]

        CableReady.perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will be set.')
        assert.equal(element.dataset.muscles, 'sore')
      })

      it('should update attributes of the morph target', async () => {
        const dom = await fixture(
          html(`<div id="morph" data-muscles="pre">Pre-Operation</div>`)
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: `<div id="morph" data-muscles="sore">data-muscles will be updated.</div>`
          }
        ]

        CableReady.perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will be updated.')
        assert.equal(element.dataset.muscles, 'sore')
      })
    })

    context('childrenOnly: true', () => {
      it('should just update the children', async () => {
        const dom = await fixture(html(`<div id="morph">Pre-Operation</div>`))
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: 'Post-Operation',
            childrenOnly: true
          }
        ]

        CableReady.perform(operations)

        assert.equal(element.innerHTML, 'Post-Operation')
        assert.equal(Object.keys(document.body.dataset).length, 0)
      })

      it('should not override attributes of the morph target', async () => {
        const dom = await fixture(
          html(`<div id="morph" data-muscles="pre">Pre-Operation</div>`)
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: 'Post-Operation',
            childrenOnly: true
          }
        ]

        CableReady.perform(operations)

        assert.equal(element.innerHTML, 'Post-Operation')
        assert.equal(element.dataset.muscles, 'pre')
      })
    })
  })
})
