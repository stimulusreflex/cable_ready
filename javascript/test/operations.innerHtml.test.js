import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('operations', () => {
  context('innerHtml', () => {
    it('should replace innerHtml of element', () => {
      const dom = new JSDOM('<div id="inner_html">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [
          { selector: '#inner_html', html: '<i>CableReady rocks</i>' }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, '<i>CableReady rocks</i>')
    })

    it('should replace innerHtml of element with surrounding tag', () => {
      const dom = new JSDOM('<div id="inner_html">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [
          {
            selector: '#inner_html',
            html: '<div id="inner_html"><i>Post-Operation</i></div>'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(
        element.innerHTML,
        '<div id="inner_html"><i>Post-Operation</i></div>'
      )
    })

    it('should replace innerHtml of multiple elements', () => {
      const dom = new JSDOM(
        `
      <div class="inner_html">Pre-Operation</div>
      <div class="inner_html">Pre-Operation</div>
      <div class="inner_html">Pre-Operation</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        innerHtml: [
          {
            selector: '.inner_html',
            html: '<i>CableReady rocks</i>',
            selectAll: true
          }
        ]
      }
      const elements = document.querySelectorAll('.inner_html')

      assert.equal(elements.length, 3)

      CableReady.perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, '<i>CableReady rocks</i>')
      })
    })

    it('should replace innerHtml of XPath element', () => {
      const dom = new JSDOM(
        `
      <div>
        <div></div>
        <div>
          <div>
            <div></div>
            <div>
              <span></span>
              <span>Pre-Operation</span>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      `
      )
      global.document = dom.window.document

      const element = document.querySelectorAll('span')[1]
      const operations = {
        innerHtml: [
          {
            selector: '/html/body/div/div[2]/div[1]/div[2]/span[2]',
            html: '<i>Post-Operation</i>',
            xpath: true
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, '<i>Post-Operation</i>')
    })

    it('should execute multiple innerHtml operations in sequence', () => {
      const dom = new JSDOM(
        `
      <div class="inner_html" id="inner_html-1">Pre-Operation</div>
      <div class="inner_html" id="inner_html-2">Pre-Operation</div>
      <div class="inner_html" id="inner_html-3">Pre-Operation</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        innerHtml: [
          { selector: '#inner_html-1', html: 'Post-Operation 1' },
          { selector: '#inner_html-2', html: 'Post-Operation 2' },
          { selector: '#inner_html-3', html: 'Post-Operation 3' }
        ]
      }

      let beforeCount = 0
      let afterCount = 0

      const elements = document.querySelectorAll('.inner_html')

      elements.forEach(element => {
        element.addEventListener('cable-ready:before-inner-html', event => {
          assert.equal(event.detail.element, element)
          assert.equal(event.detail.html.slice(-1), element.id.slice(-1))

          beforeCount += 1
        })

        element.addEventListener('cable-ready:after-inner-html', event => {
          assert.equal(event.detail.element, element)
          assert.equal(event.detail.html.slice(-1), element.id.slice(-1))

          afterCount += 1
        })
      })

      assert.equal(beforeCount, 0)
      assert.equal(afterCount, 0)

      CableReady.perform(operations)

      assert.equal(beforeCount, 3)
      assert.equal(afterCount, 3)

      assert.equal(
        document.querySelector('#inner_html-1').innerHTML,
        'Post-Operation 1'
      )
      assert.equal(
        document.querySelector('#inner_html-2').innerHTML,
        'Post-Operation 2'
      )
      assert.equal(
        document.querySelector('#inner_html-3').innerHTML,
        'Post-Operation 3'
      )
    })

    it('should focus target after operation', () => {
      const dom = new JSDOM(
        `
      <div id="inner_html">Pre-Operation</div>
      <input type="text" id="inner_html-focus">
      `
      )
      global.document = dom.window.document

      const operations = {
        innerHtml: [
          {
            selector: '#inner_html',
            html: '<i>CableReady rocks</i>',
            focusSelector: '#inner_html-focus'
          }
        ]
      }
      const element = document.querySelector('#inner_html')
      const focusElement = document.querySelector('#inner_html-focus')

      let focused = false

      focusElement.addEventListener('focusin', event => {
        assert(event)
        focused = true
      })

      refute(focused)

      CableReady.perform(operations)

      assert(focused)
    })

    it('should emit before and after events on element', () => {
      const dom = new JSDOM('<div id="inner_html"></div>')
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [{ selector: '#inner_html', html: '<i>Post-Operation</i>' }]
      }

      let beforeEvent = false
      let afterEvent = false

      element.addEventListener('cable-ready:before-inner-html', event => {
        beforeEvent = true

        assert.equal(event.type, 'cable-ready:before-inner-html')
        assert.equal(event.detail.selector, '#inner_html')
        assert.equal(event.detail.html, '<i>Post-Operation</i>')
        assert.equal(event.detail.element, element)
      })

      element.addEventListener('cable-ready:after-inner-html', event => {
        afterEvent = true

        assert.equal(event.type, 'cable-ready:after-inner-html')
        assert.equal(event.detail.selector, '#inner_html')
        assert.equal(event.detail.html, '<i>Post-Operation</i>')
        assert.equal(event.detail.element, element)
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
          <div id="inner_html"></div>
        </div>
      </div>
      `
      )
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [{ selector: '#inner_html', html: 'Post-Operation' }]
      }

      let beforeEvent = false
      let afterEvent = false

      const parent = document.querySelector('#parent')

      parent.addEventListener('cable-ready:before-inner-html', event => {
        beforeEvent = true
        assert(event.bubbles)
        assert.equal(event.detail.element, element)
      })

      parent.addEventListener('cable-ready:after-inner-html', event => {
        afterEvent = true
        assert(event.bubbles)
        assert.equal(event.detail.element, element)
      })

      refute(beforeEvent)
      refute(afterEvent)

      CableReady.perform(operations)

      assert(beforeEvent)
      assert(afterEvent)
    })

    it('should stop execution if operation gets cancelled', () => {
      const dom = new JSDOM('<div id="inner_html">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [{ selector: '#inner_html', html: '<i>Post-Operation</i>' }]
      }

      let cancelled = false
      let afterCalled = false

      element.addEventListener('cable-ready:before-inner-html', event => {
        event.detail.cancel = true
        cancelled = true
      })

      element.addEventListener('cable-ready:after-inner-html', event => {
        assert(event.detail.cancel)
        afterCalled = true
      })

      refute(cancelled)
      refute(afterCalled)

      CableReady.perform(operations)

      assert(cancelled)
      assert(afterCalled)

      assert.equal(element.innerHTML, 'Pre-Operation')
    })

    it('should not execute transmitted cancelled operation', () => {
      const dom = new JSDOM('<div id="inner_html">Pre-Operation</div>')
      global.document = dom.window.document

      const element = document.querySelector('#inner_html')
      const operations = {
        innerHtml: [
          {
            selector: '#inner_html',
            html: '<i>Post-Operation</i>',
            cancel: true
          }
        ]
      }

      let beforeCalled = false
      let afterCalled = false

      element.addEventListener('cable-ready:before-inner-html', event => {
        assert(event.detail.cancel)
        beforeCalled = true
      })

      element.addEventListener('cable-ready:after-inner-html', event => {
        assert(event.detail.cancel)
        afterCalled = true
      })

      refute(beforeCalled)
      refute(afterCalled)

      CableReady.perform(operations)

      assert(beforeCalled)
      assert(afterCalled)

      assert.equal(element.innerHTML, 'Pre-Operation')
    })
  })
})
