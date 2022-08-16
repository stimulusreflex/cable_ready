import { html, fixture, assert } from '@open-wc/testing'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('insertAdjacentHtml', () => {
    it('should insert adjacent html beforeend', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_html"><span>CableReady</span></div>
        `
      )

      const element = document.querySelector('#insert_adjacent_html')
      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html span',
          html: '<span>beforeend</span>'
        }
      ]

      perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>CableReady<span>beforeend</span></span>'
      )
    })

    it('should insert adjacent html afterbegin', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_html"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_html')
      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html span',
          html: '<span>afterbegin</span>',
          position: 'afterbegin'
        }
      ]

      perform(operations)

      assert.equal(
        element.innerHTML,
        '<span><span>afterbegin</span>CableReady</span>'
      )
    })

    it('should insert adjacent html beforebegin', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_html"><span>CableReady</span></div>
        `
      )

      const element = document.querySelector('#insert_adjacent_html')
      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html span',
          html: '<span>beforebegin</span>',
          position: 'beforebegin'
        }
      ]

      perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>beforebegin</span><span>CableReady</span>'
      )
    })

    it('should insert adjacent html afterend', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_html"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_html')
      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html span',
          html: '<span>afterend</span>',
          position: 'afterend'
        }
      ]

      perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>CableReady</span><span>afterend</span>'
      )
    })

    it('should insert adjacent html for multiple elements', async () => {
      const dom = await fixture(html`
        <div class="insert_adjacent_html">CableReady</div>
        <div class="insert_adjacent_html">CableReady</div>
        <div class="insert_adjacent_html">CableReady</div>
      `)

      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '.insert_adjacent_html',
          html: '<span>beforeend</span>',
          selectAll: true
        }
      ]
      const elements = document.querySelectorAll('.insert_adjacent_html')

      assert.equal(elements.length, 3)

      perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, 'CableReady<span>beforeend</span>')
      })
    })

    it('should insert adjacent html for XPath element', async () => {
      const dom = await fixture(html`
        <div id="root">
          <div></div>
          <div>
            <div>
              <div></div>
              <div>
                <span></span>
                <span>CableReady</span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      `)

      const element = document.querySelectorAll('span')[1]
      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '//div[@id="root"]/div[2]/div[1]/div[2]/span[2]',
          html: '<span>beforeend</span>',
          xpath: true
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, 'CableReady<span>beforeend</span>')
    })

    it('should execute multiple insertAdjacentHtml operations in sequence', async () => {
      const dom = await fixture(
        // prettier-ignore
        html`
        <div class="insert_adjacent_html" id="insert_adjacent_html-1">CableReady</div>
        <div class="insert_adjacent_html" id="insert_adjacent_html-2">CableReady</div>
        <div class="insert_adjacent_html" id="insert_adjacent_html-3">CableReady</div>
        `
      )

      const operations = [
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html-1',
          html: '<span>beforeend</span>'
        },
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html-2',
          html: '<span>beforeend</span>'
        },
        {
          operation: 'insertAdjacentHtml',
          selector: '#insert_adjacent_html-3',
          html: '<span>beforeend</span>'
        }
      ]

      let beforeCount = 0
      let afterCount = 0

      const elements = document.querySelectorAll('.insert_adjacent_html')

      elements.forEach(element => {
        element.addEventListener(
          'cable-ready:before-insert-adjacent-html',
          event => {
            assert.equal(event.detail.element, element)

            beforeCount += 1
          }
        )

        element.addEventListener(
          'cable-ready:after-insert-adjacent-html',
          event => {
            assert.equal(event.detail.element, element)

            afterCount += 1
          }
        )
      })

      assert.equal(beforeCount, 0)
      assert.equal(afterCount, 0)

      perform(operations)

      assert.equal(beforeCount, 3)
      assert.equal(afterCount, 3)

      elements.forEach(element => {
        assert.equal(element.innerHTML, 'CableReady<span>beforeend</span>')
      })
    })
  })
})
