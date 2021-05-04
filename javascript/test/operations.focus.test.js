import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

const events = [
  {
    selector: 'inner_html',
    operations: {
      innerHtml: [
        {
          selector: '#inner_html',
          html: '<i>CableReady rocks innerHtml</i>',
          focusSelector: '#inner_html-focus'
        }
      ]
    }
  },

  {
    selector: 'insert_adjacent_html',
    operations: {
      insertAdjacentHtml: [
        {
          selector: '#insert_adjacent_html',
          html: '<i>CableReady rocks insertAdjacentHtml</i>',
          focusSelector: '#insert_adjacent_html-focus'
        }
      ]
    }
  }
]

describe('operations', () => {
  context('focus', () => {
    it('should focus target after operation', () => {
      events.forEach(event => {
        const { selector, operations } = event

        const dom = new JSDOM(
          `
          <div id="${selector}">Pre-Operation</div>
          <input type="text" id="${selector}-focus">
          `
        )
        global.document = dom.window.document

        const element = document.querySelector(`#${selector}`)
        const focusElement = document.querySelector(`#${selector}-focus`)

        let focused = false

        focusElement.addEventListener('focusin', event => {
          assert(event)
          focused = true
        })

        refute(focused)

        CableReady.perform(operations)

        assert(focused)
      })
    })
  })
})
