import { html, fixture, assert } from '@open-wc/testing'
import refute from './refute'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('events', () => {
    it('should emit before and after events on element', async () => {
      const innerHtmlEvent = {
        domContent: html`
          <div id="inner_html"></div>
        `,
        selector: '#inner_html',
        name: 'inner-html',
        eventDetailHtml: '<i>Post-Operation inner_html</i>',
        operations: [
          {
            operation: 'innerHtml',
            selector: '#inner_html',
            html: '<i>Post-Operation inner_html</i>'
          }
        ]
      }

      const insertAdjacentHtmlEvent = {
        domContent: html`
          <div id="insert_adjacent_html"></div>
        `,
        selector: '#insert_adjacent_html',
        name: 'insert-adjacent-html',
        eventDetailHtml: '<i>Post-Operation insert_adjacent_html</i>',
        operations: [
          {
            operation: 'insertAdjacentHtml',
            selector: '#insert_adjacent_html',
            html: '<i>Post-Operation insert_adjacent_html</i>'
          }
        ]
      }

      const testEvent = async event => {
        const {
          name,
          selector,
          domContent,
          operations,
          eventDetailHtml
        } = event

        const dom = await fixture(domContent)
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

        perform(operations)

        assert(beforeEvent)
        assert(afterEvent)
      }

      await testEvent(innerHtmlEvent)
      await testEvent(insertAdjacentHtmlEvent)
    })

    it('should bubble up the DOM tree', async () => {
      const innerHtmlEvent = {
        domContent: html`
          <div id="parent-inner-html">
            <div>
              <div id="inner_html"></div>
            </div>
          </div>
        `,
        selector: '#inner_html',
        name: 'inner-html',
        operations: [
          {
            operation: 'innerHtml',
            selector: '#inner_html',
            html: 'Post-Operation inner_html'
          }
        ]
      }

      const insertAdjacentHtmlEvent = {
        domContent: html`
          <div id="parent-insert-adjacent-html">
            <div>
              <div id="insert_adjacent_html"></div>
            </div>
          </div>
        `,
        selector: '#insert_adjacent_html',
        name: 'insert-adjacent-html',
        operations: [
          {
            operation: 'insertAdjacentHtml',
            selector: '#insert_adjacent_html',
            html: 'Post-Operation insert_adjacent_html'
          }
        ]
      }

      const testEvent = async event => {
        const { name, selector, domContent, operations } = event

        const dom = await fixture(domContent)
        const element = document.querySelector(selector)

        let beforeEvent = false
        let afterEvent = false

        const parent = document.querySelector(`#parent-${name}`)

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

        perform(operations)

        assert(beforeEvent)
        assert(afterEvent)
      }

      await testEvent(innerHtmlEvent)
      await testEvent(insertAdjacentHtmlEvent)
    })
  })
})
