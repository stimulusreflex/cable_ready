import { html, fixture, assert } from '@open-wc/testing'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('insertAdjacentText', () => {
    it('should insert adjacent text beforeend', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_text"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_text')
      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text span',
          text: 'beforeend'
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, '<span>CableReadybeforeend</span>')
    })

    it('should insert adjacent text afterbegin', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_text"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_text')
      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text span',
          text: 'afterbegin',
          position: 'afterbegin'
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, '<span>afterbeginCableReady</span>')
    })

    it('should insert adjacent text beforebegin', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_text"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_text')
      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text span',
          text: 'beforebegin',
          position: 'beforebegin'
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, 'beforebegin<span>CableReady</span>')
    })

    it('should insert adjacent text afterend', async () => {
      const dom = await fixture(
        html`
          <div id="insert_adjacent_text"><span>CableReady</span></div>
        `
      )
      const element = document.querySelector('#insert_adjacent_text')
      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text span',
          text: 'afterend',
          position: 'afterend'
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, '<span>CableReady</span>afterend')
    })

    it('should insert adjacent text for multiple elements', async () => {
      const dom = await fixture(html`
        <div class="insert_adjacent_text">CableReady</div>
        <div class="insert_adjacent_text">CableReady</div>
        <div class="insert_adjacent_text">CableReady</div>
      `)

      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '.insert_adjacent_text',
          text: 'beforeend',
          selectAll: true
        }
      ]
      const elements = document.querySelectorAll('.insert_adjacent_text')

      assert.equal(elements.length, 3)

      perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, 'CableReadybeforeend')
      })
    })

    it('should insert adjacent text for XPath element', async () => {
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
          operation: 'insertAdjacentText',
          selector: '//div[@id="root"]/div[2]/div[1]/div[2]/span[2]',
          text: 'beforeend',
          xpath: true
        }
      ]

      perform(operations)

      assert.equal(element.innerHTML, 'CableReadybeforeend')
    })

    it('should execute multiple insertAdjacentText operations in sequence', async () => {
      const dom = await fixture(
        // prettier-ignore
        html`
        <div class="insert_adjacent_text" id="insert_adjacent_text-1">CableReady</div>
        <div class="insert_adjacent_text" id="insert_adjacent_text-2">CableReady</div>
        <div class="insert_adjacent_text" id="insert_adjacent_text-3">CableReady</div>
      `
      )

      const operations = [
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text-1',
          text: 'beforeend'
        },
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text-2',
          text: 'beforeend'
        },
        {
          operation: 'insertAdjacentText',
          selector: '#insert_adjacent_text-3',
          text: 'beforeend'
        }
      ]

      let beforeCount = 0
      let afterCount = 0

      const elements = document.querySelectorAll('.insert_adjacent_text')

      elements.forEach(element => {
        element.addEventListener(
          'cable-ready:before-insert-adjacent-text',
          event => {
            assert.equal(event.detail.element, element)

            beforeCount += 1
          }
        )

        element.addEventListener(
          'cable-ready:after-insert-adjacent-text',
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
        assert.equal(element.innerHTML, 'CableReadybeforeend')
      })
    })
  })
})
