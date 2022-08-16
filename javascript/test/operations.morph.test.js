import { html, fixture, assert } from '@open-wc/testing'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('morph', () => {
    context('childrenOnly: false', () => {
      it('should not add attributes to the morph target', async () => {
        const dom = await fixture(
          html`
            <div id="morph">Pre-Operation</div>
          `
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html:
              '<div id="morph" data-muscles="sore">data-muscles will not be set.</div>'
          }
        ]

        perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will not be set.')
        assert.equal(element.dataset.muscles, 'sore')
      })

      it('should not override attributes of the morph target', async () => {
        const dom = await fixture(
          html`
            <div id="morph" data-muscles="pre">Pre-Operation</div>
          `
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html:
              '<div id="morph" data-muscles="sore">data-muscles will not be set.</div>'
          }
        ]

        perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will not be set.')
        assert.equal(element.dataset.muscles, 'sore')
      })
    })

    context('childrenOnly: true', () => {
      it('should not add attributes to the morph target', async () => {
        const dom = await fixture(
          html`
            <div id="morph">Pre-Operation</div>
          `
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: 'data-muscles will not be set.',
            childrenOnly: true
          }
        ]

        perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will not be set.')
        assert.equal(Object.keys(document.body.dataset).length, 0)
      })

      it('should not override attributes of the morph target', async () => {
        const dom = await fixture(
          html`
            <div id="morph" data-muscles="pre">Pre-Operation</div>
          `
        )
        const element = document.querySelector('#morph')
        const operations = [
          {
            operation: 'morph',
            selector: '#morph',
            html: 'data-muscles will not be set.',
            childrenOnly: true
          }
        ]

        perform(operations)

        assert.equal(element.innerHTML, 'data-muscles will not be set.')
        assert.equal(element.dataset.muscles, 'pre')
      })
    })
  })
})
