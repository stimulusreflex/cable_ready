import { html, fixture, assert } from '@open-wc/testing'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('innerHtml', () => {
    it('should replace innerHtml of element', async () => {
      const dom = await fixture('<div id="inner_html">Pre-Operation</div>')
      const element = document.querySelector('#inner_html')
      const operations = [
        {
          operation: 'innerHtml',
          selector: '#inner_html',
          html: '<i>CableReady rocks</i>'
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, '<i>CableReady rocks</i>')
    })

    it('should replace innerHtml of element with surrounding tag', async () => {
      const dom = await fixture('<div id="inner_html">Pre-Operation</div>')
      const element = document.querySelector('#inner_html')
      const operations = [
        {
          operation: 'innerHtml',
          selector: '#inner_html',
          html: '<div id="inner_html"><i>Post-Operation</i></div>'
        }
      ]

      perform(operations)

      assert.equal(
        element.innerHTML,
        '<div id="inner_html"><i>Post-Operation</i></div>'
      )
    })

    it('should replace innerHtml of multiple elements', async () => {
      const dom = await fixture(html`
        <div class="inner_html">Pre-Operation</div>
        <div class="inner_html">Pre-Operation</div>
        <div class="inner_html">Pre-Operation</div>
      `)

      const operations = [
        {
          operation: 'innerHtml',
          selector: '.inner_html',
          html: '<i>CableReady rocks</i>',
          selectAll: true
        }
      ]
      const elements = document.querySelectorAll('.inner_html')

      assert.equal(elements.length, 3)

      perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, '<i>CableReady rocks</i>')
      })
    })

    it('should replace innerHtml of XPath element', async () => {
      const dom = await fixture(html`
        <div id="root">
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
      `)

      const element = document.querySelectorAll('span')[1]
      const operations = [
        {
          operation: 'innerHtml',
          selector: '//div[@id="root"]/div[2]/div[1]/div[2]/span[2]',
          html: '<i>Post-Operation</i>',
          xpath: true
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, '<i>Post-Operation</i>')
    })

    it('should execute multiple innerHtml operations in sequence', async () => {
      const dom = await fixture(html`
        <div class="inner_html" id="inner_html-1">Pre-Operation</div>
        <div class="inner_html" id="inner_html-2">Pre-Operation</div>
        <div class="inner_html" id="inner_html-3">Pre-Operation</div>
      `)

      const operations = [
        {
          operation: 'innerHtml',
          selector: '#inner_html-1',
          html: 'Post-Operation 1'
        },
        {
          operation: 'innerHtml',
          selector: '#inner_html-2',
          html: 'Post-Operation 2'
        },
        {
          operation: 'innerHtml',
          selector: '#inner_html-3',
          html: 'Post-Operation 3'
        }
      ]

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

      perform(operations)

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
  })
})
