import { html, fixture, assert } from '@open-wc/testing'
import refute from './refute'

import { perform } from '../cable_ready'

const events = [
  {
    domContent: html`
      <div id="inner_html">Pre-Operation innerHtml</div>
    `,
    selector: '#inner_html',
    eventName: 'inner-html',
    name: 'innerHtml',
    expected: 'Pre-Operation innerHtml',
    operations: [
      {
        operation: 'innerHtml',
        selector: '#inner_html',
        html: '<i>Post-Operation</i>'
      }
    ]
  },
  {
    domContent: html`
      <div id="insert_adjacent_html">Pre-Operation insertAdjacentHtml</div>
    `,
    selector: '#insert_adjacent_html',
    eventName: 'insert-adjacent-html',
    name: 'insertAdjacentHtml',
    expected: 'Pre-Operation insertAdjacentHtml',
    operations: [
      {
        operation: 'insertAdjacentHtml',
        selector: '#insert_adjacent_html',
        html: '<i>Post-Operation</i>'
      }
    ]
  }
]

describe('operations', () => {
  context('cancel', () => {
    it('should not execute transmitted cancelled operation', async () => {
      let eventCount = 0

      const cancelledEvents = events.map(event => {
        event.operations.map(operation => (operation.cancel = true))

        return event
      })

      Promise.all(
        cancelledEvents.map(async event => {
          const {
            domContent,
            selector,
            eventName,
            operations,
            expected
          } = event
          const dom = await fixture(domContent)
          const element = document.querySelector(selector)

          let beforeCalled = false
          let afterCalled = false

          element.addEventListener(`cable-ready:before-${eventName}`, event => {
            assert(event.detail.cancel)
            beforeCalled = true
          })

          element.addEventListener(`cable-ready:after-${eventName}`, event => {
            assert(event.detail.cancel)
            afterCalled = true
          })

          refute(beforeCalled)
          refute(afterCalled)

          perform(operations)

          assert(beforeCalled)
          assert(afterCalled)

          assert.equal(element.innerHTML, expected)

          eventCount += 1
        })
      ).then(() => {
        assert.equal(eventCount, events.length)
      })
    })

    it('should stop execution if operation gets cancelled', async () => {
      let eventCount = 0

      const cancelledEvents = events.map(event => {
        event.operations.map(operation => (operation.cancel = false))

        return event
      })

      Promise.all(
        events.map(async event => {
          const {
            domContent,
            selector,
            eventName,
            operations,
            expected
          } = event

          const dom = await fixture(domContent)
          const element = document.querySelector(selector)

          let cancelled = false
          let afterCalled = false

          element.addEventListener(`cable-ready:before-${eventName}`, event => {
            event.detail.cancel = true
            cancelled = true
          })

          element.addEventListener(`cable-ready:after-${eventName}`, event => {
            assert(event.detail.cancel)
            afterCalled = true
          })

          refute(cancelled)
          refute(afterCalled)

          perform(operations)

          assert(cancelled)
          assert(afterCalled)

          assert.equal(element.innerHTML, expected)

          eventCount += 1
        })
      ).then(() => {
        assert.equal(eventCount, events.length)
      })
    })
  })
})
