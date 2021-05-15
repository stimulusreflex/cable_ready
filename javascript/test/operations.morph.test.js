import assert from 'assert'
import { JSDOM } from 'jsdom'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('morph', () => {
    it('should not add attributes to the morph target', () => {
      const dom = new JSDOM('<div id="morph">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#morph')
      const operations = {
        morph: [
          { selector: '#morph', html: '<div id="morph" data-muscles="sore">data-muscles will not be set.</div>' }
        ]
      }

      perform(operations)

      assert.equal(element.innerHTML, 'data-muscles will not be set.')
      assert.equal(element.dataset.muscles, null)
    })

    it('should not override attributes of the morph target', () => {
      const dom = new JSDOM('<div id="morph" data-muscles="pre">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#morph')
      const operations = {
        morph: [
          { selector: '#morph', html: '<div id="morph" data-muscles="sore">data-muscles will not be set.</div>' }
        ]
      }

      perform(operations)

      assert.equal(element.innerHTML, 'data-muscles will not be set.')
      assert.equal(element.dataset.muscles, "pre")
    })
  })
})
