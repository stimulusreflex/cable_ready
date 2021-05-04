import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('operations', () => {
  context('events', () => {
    it('should emit before and after events on element', () => {
      const events = [
        {
          domContent: '<div id="inner_html"></div>',
          selector: '#inner_html',
          name: 'inner-html',
          eventDetailHtml: '<i>Post-Operation inner_html</i>',
          operations: {
            innerHtml: [
              {
                selector: '#inner_html',
                html: '<i>Post-Operation inner_html</i>'
              }
            ]
          }
        },
        {
          domContent: '<div id="insert_adjacent_html"></div>',
          selector: '#insert_adjacent_html',
          name: 'insert-adjacent-html',
          eventDetailHtml: '<i>Post-Operation insert_adjacent_html</i>',
          operations: {
            insertAdjacentHtml: [
              {
                selector: '#insert_adjacent_html',
                html: '<i>Post-Operation insert_adjacent_html</i>'
              }
            ]
          }
        }
      ]

      events.forEach(event => {
        const {
          name,
          selector,
          domContent,
          operations,
          eventDetailHtml
        } = event

        const dom = new JSDOM(domContent)
        global.document = dom.window.document

        const element = document.querySelector(selector)

        let beforeEvent = false
        let afterEvent = false

        element.addEventListener(`cable-ready:before-${name}`, event => {
          beforeEvent = true

          assert.equal(event.type, `cable-ready:before-${name}`)
          assert.equal(event.detail.selector, selector)
          assert.equal(event.detail.html, eventDetailHtml)
          assert.equal(event.detail.element, element)
        })

        element.addEventListener(`cable-ready:after-${name}`, event => {
          afterEvent = true

          assert.equal(event.type, `cable-ready:after-${name}`)
          assert.equal(event.detail.selector, selector)
          assert.equal(event.detail.html, eventDetailHtml)
          assert.equal(event.detail.element, element)
        })

        refute(beforeEvent)
        refute(afterEvent)

        CableReady.perform(operations)

        assert(beforeEvent)
        assert(afterEvent)
      })
    })

    it('should bubble up the DOM tree', () => {
      const events = [
        {
          domContent: '<div id="inner_html"></div>',
          selector: '#inner_html',
          name: 'inner-html',
          operations: {
            innerHtml: [
              { selector: '#inner_html', html: 'Post-Operation inner_html' }
            ]
          }
        },
        {
          domContent: '<div id="insert_adjacent_html"></div>',
          selector: '#insert_adjacent_html',
          name: 'insert-adjacent-html',
          operations: {
            insertAdjacentHtml: [
              {
                selector: '#insert_adjacent_html',
                html: 'Post-Operation insert_adjacent_html'
              }
            ]
          }
        }
      ]

      events.forEach(event => {
        const { name, selector, domContent, operations } = event

        const dom = new JSDOM(
          `
          <div id="parent">
            <div>
              ${domContent}
            </div>
          </div>
          `
        )

        global.document = dom.window.document

        const element = document.querySelector(selector)

        let beforeEvent = false
        let afterEvent = false

        const parent = document.querySelector('#parent')

        parent.addEventListener(`cable-ready:before-${name}`, event => {
          beforeEvent = true
          assert(event.bubbles)
          assert.equal(event.detail.element, element)
        })

        parent.addEventListener(`cable-ready:after-${name}`, event => {
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
    })
  })
})
