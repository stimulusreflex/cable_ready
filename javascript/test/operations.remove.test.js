import { html, fixture, assert } from '@open-wc/testing'
import sinon from 'sinon'
import refute from './refute'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('remove', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should remove element', async () => {
      const dom = await fixture(
        html`
          <div id="parent"><div id="remove">Remove</div></div>
        `
      )
      const parent = document.querySelector('#parent')
      const operations = [{ operation: 'remove', selector: '#remove' }]

      assert.equal(parent.innerHTML, '<div id="remove">Remove</div>')

      perform(operations)

      assert.equal(parent.innerHTML, '')
      assert.equal(document.querySelector('#remove'), null)
    })

    it('should remove element with all child elements', async () => {
      const dom = await fixture(html`
        <div id="parent">
          <div id="remove">
            <div id="child1">Remove</div>
            <div id="child2">
              <div id="child3">Remove</div>
              <div id="child4">Remove</div>
            </div>
          </div>
        </div>
      `)

      const parent = document.querySelector('#parent')
      const operations = [{ operation: 'remove', selector: '#remove' }]
      const ids = ['#remove', '#child1', '#child2', '#child3', '#child4']

      assert(document.querySelector('#parent'))
      ids.forEach(id => assert(document.querySelector(id)))

      perform(operations)

      assert.equal(parent.innerHTML.trim(), '')
      assert(document.querySelector('#parent'))
      ids.forEach(id => refute(document.querySelector(id)))
    })

    it('should emit console warning if element doesnt exist', async () => {
      const dom = await fixture(
        html`
          <div id="parent"></div>
        `
      )
      const parent = document.querySelector('#parent')
      const operations = [{ operation: 'remove', selector: '#doesntexist' }]
      sinon.replace(console, 'warn', sinon.fake())
      const text =
        "CableReady remove operation failed due to missing DOM element for selector: '#doesntexist'"

      perform(operations)

      assert(console.warn.calledWith(text))
    })
  })
})
