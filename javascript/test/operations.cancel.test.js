import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

const events = [
  {
    domContent: '<div id="inner_html">Pre-Operation innerHtml</div>',
    selector: '#inner_html',
    eventName: 'inner-html',
    name: 'innerHtml',
    expected: 'Pre-Operation innerHtml',
    operations: {
      innerHtml: [
        {
          selector: '#inner_html',
          html: '<i>Post-Operation</i>'
        }
      ]
    }
  },
  {
    domContent:
      '<div id="insert_adjacent_html">Pre-Operation insertAdjacentHtml</div>',
    selector: '#insert_adjacent_html',
    eventName: 'insert-adjacent-html',
    name: 'insertAdjacentHtml',
    expected: 'Pre-Operation insertAdjacentHtml',
    operations: {
      insertAdjacentHtml: [
        {
          selector: '#insert_adjacent_html',
          html: '<i>Post-Operation</i>'
        }
      ]
    }
  }
]

describe('operations', () => {
  context('cancel', () => {
    it('should not execute transmitted cancelled operation', () => {
      let eventCount = 0

      const cancelledEvents = events.map(event => {
        event.operations[event.name].map(operation => (operation.cancel = true))

        return event
      })

      cancelledEvents.forEach(event => {
        const { domContent, selector, eventName, operations, expected } = event

        const dom = new JSDOM(domContent)
        global.document = dom.window.document

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

        CableReady.perform(operations)

        assert(beforeCalled)
        assert(afterCalled)

        assert.equal(element.innerHTML, expected)

        eventCount += 1
      })

      assert.equal(eventCount, events.length)
    })

    it('should stop execution if operation gets cancelled', () => {
      let eventCount = 0

      const cancelledEvents = events.map(event => {
        event.operations[event.name].map(
          operation => (operation.cancel = false)
        )

        return event
      })

      events.forEach(event => {
        const { domContent, selector, eventName, operations, expected } = event

        const dom = new JSDOM(domContent)
        global.document = dom.window.document

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

        CableReady.perform(operations)

        assert(cancelled)
        assert(afterCalled)

        assert.equal(element.innerHTML, expected)

        eventCount += 1
      })

      assert.equal(eventCount, events.length)
    })
  })
})
