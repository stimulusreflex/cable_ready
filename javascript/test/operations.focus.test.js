import { html, fixture, assert } from '@open-wc/testing'
import refute from './refute'

import { perform } from '../cable_ready'

const events = [
  {
    selector: 'inner_html',
    operations: [
      {
        operation: 'innerHtml',
        selector: '#inner_html',
        html: '<i>CableReady rocks innerHtml</i>',
        focusSelector: '#inner_html-focus'
      }
    ]
  },

  {
    selector: 'insert_adjacent_html',
    operations: [
      {
        operation: 'insertAdjacentHtml',
        selector: '#insert_adjacent_html',
        html: '<i>CableReady rocks insertAdjacentHtml</i>',
        focusSelector: '#insert_adjacent_html-focus'
      }
    ]
  }
]

describe('operations', () => {
  context('focus', () => {
    it('should focus target after operation', async () => {
      events.forEach(async event => {
        const { selector, operations } = event

        const dom = await fixture(html`
          <div id="${selector}">Pre-Operation</div>
          <input type="text" id="${selector}-focus" />
        `)

        const element = document.querySelector(`#${selector}`)
        const focusElement = document.querySelector(`#${selector}-focus`)

        let focused = false

        focusElement.addEventListener('focusin', event => {
          assert(event)
          focused = true
        })

        refute(focused)

        perform(operations)

        assert(focused)
      })
    })
  })
})
