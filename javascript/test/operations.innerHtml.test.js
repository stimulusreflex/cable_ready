import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('innerHtml', () => {
  it('should replace innerHtml of element', () => {
    const dom = new JSDOM('<div id="test"></div>')
    global.document = dom.window.document

    const element = document.querySelector('#test')
    const operations = { innerHtml: [{ selector: '#test', html: 'test' }] }

    CableReady.perform(operations)

    assert.equal('test', element.textContent)
  })

  it('should emit before and after events on element', () => {
    const dom = new JSDOM('<div id="test"></div>')
    global.document = dom.window.document

    const element = document.querySelector('#test')
    const operations = {
      innerHtml: [{ selector: '#test', html: '<div class="test">test</div>' }]
    }

    let beforeEvent = false
    let afterEvent = false

    element.addEventListener('cable-ready:before-inner-html', event => {
      beforeEvent = true

      assert.equal('cable-ready:before-inner-html', event.type)
      assert.equal('#test', event.detail.selector)
      assert.equal('<div class="test">test</div>', event.detail.html)
      assert.equal(element, event.detail.element)
    })

    element.addEventListener('cable-ready:after-inner-html', event => {
      afterEvent = true

      assert.equal('cable-ready:after-inner-html', event.type)
      assert.equal('#test', event.detail.selector)
      assert.equal('<div class="test">test</div>', event.detail.html)
      assert.equal(element, event.detail.element)
    })

    refute(beforeEvent)
    refute(afterEvent)

    CableReady.perform(operations)

    assert(beforeEvent)
    assert(afterEvent)
  })

  it('should bubble up the DOM tree', () => {
    const dom = new JSDOM(
      `
      <div id="parent">
        <div>
          <div id="test"></div>
        </div>
      </div>
      `
    )
    global.document = dom.window.document

    const element = document.querySelector('#test')
    const operations = {
      innerHtml: [{ selector: '#test', html: '<div class="test">test</div>' }]
    }

    let beforeEvent = false
    let afterEvent = false

    const parent = document.querySelector('#parent')

    parent.addEventListener('cable-ready:before-inner-html', event => {
      beforeEvent = true
      assert(event.bubbles)
      assert.equal(element, event.detail.element)
    })

    parent.addEventListener('cable-ready:after-inner-html', event => {
      afterEvent = true
      assert(event.bubbles)
      assert.equal(element, event.detail.element)
    })

    refute(beforeEvent)
    refute(afterEvent)

    CableReady.perform(operations)

    assert(beforeEvent)
    assert(afterEvent)
  })
})
