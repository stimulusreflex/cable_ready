import assert from 'assert'
import sinon from 'sinon'
import refute from './refute'
import { JSDOM } from 'jsdom'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('remove', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should remove element', () => {
      const dom = new JSDOM(
        '<div id="parent"><div id="remove">Remove</div></div>'
      )
      global.document = dom.window.document

      const parent = document.querySelector('#parent')
      const operations = { remove: [{ selector: '#remove' }] }

      assert.equal(parent.innerHTML, '<div id="remove">Remove</div>')

      perform(operations)

      assert.equal(parent.innerHTML, '')
      assert.equal(document.querySelector('#remove'), null)
    })

    it('should remove element with all child elements', () => {
      const dom = new JSDOM(
        `
        <div id="parent">
          <div id="remove">
            <div id="child1">Remove</div>
            <div id="child2">
              <div id="child3">Remove</div>
              <div id="child4">Remove</div>
            </div>
          </div>
        </div>
        `
      )
      global.document = dom.window.document

      const parent = document.querySelector('#parent')
      const operations = { remove: [{ selector: '#remove' }] }
      const ids = ['#remove', '#child1', '#child2', '#child3', '#child4']

      assert(document.querySelector('#parent'))
      ids.forEach(id => assert(document.querySelector(id)))

      perform(operations)

      assert.equal(parent.innerHTML.trim(), '')
      assert(document.querySelector('#parent'))
      ids.forEach(id => refute(document.querySelector(id)))
    })

    it('should throw error if element doesnt exist', () => {
      const dom = new JSDOM('<div id="parent"></div>')
      global.document = dom.window.document

      const parent = document.querySelector('#parent')
      const operations = { remove: [{ selector: '#doesntexist' }] }
      sinon.replace(console, 'log', sinon.fake())
      const text =
        "CableReady remove failed due to missing DOM element for selector: '#doesntexist'"

      perform(operations)

      assert(console.log.calledWith(text))
    })
  })
})
