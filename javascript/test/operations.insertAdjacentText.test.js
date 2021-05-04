import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('operations', () => {
  context('insertAdjacentText', () => {
    it('should insert adjacent text beforeend', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_text"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_text')
      const operations = {
        insertAdjacentText: [
          {
            selector: '#insert_adjacent_text span',
            text: 'beforeend'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, '<span>Nate Hopkinsbeforeend</span>')
    })

    it('should insert adjacent text afterbegin', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_text"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_text')
      const operations = {
        insertAdjacentText: [
          {
            selector: '#insert_adjacent_text span',
            text: 'afterbegin',
            position: 'afterbegin'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, '<span>afterbeginNate Hopkins</span>')
    })

    it('should insert adjacent text beforebegin', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_text"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_text')
      const operations = {
        insertAdjacentText: [
          {
            selector: '#insert_adjacent_text span',
            text: 'beforebegin',
            position: 'beforebegin'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, 'beforebegin<span>Nate Hopkins</span>')
    })

    it('should insert adjacent text afterend', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_text"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_text')
      const operations = {
        insertAdjacentText: [
          {
            selector: '#insert_adjacent_text span',
            text: 'afterend',
            position: 'afterend'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, '<span>Nate Hopkins</span>afterend')
    })

    it('should insert adjacent text for multiple elements', () => {
      const dom = new JSDOM(
        `
      <div class="insert_adjacent_text">Nate Hopkins</div>
      <div class="insert_adjacent_text">Nate Hopkins</div>
      <div class="insert_adjacent_text">Nate Hopkins</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        insertAdjacentText: [
          {
            selector: '.insert_adjacent_text',
            text: 'beforeend',
            selectAll: true
          }
        ]
      }
      const elements = document.querySelectorAll('.insert_adjacent_text')

      assert.equal(elements.length, 3)

      CableReady.perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, 'Nate Hopkinsbeforeend')
      })
    })

    it('should insert adjacent text for XPath element', () => {
      const dom = new JSDOM(
        `
      <div>
        <div></div>
        <div>
          <div>
            <div></div>
            <div>
              <span></span>
              <span>Nate Hopkins</span>
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
        insertAdjacentText: [
          {
            selector: '/html/body/div/div[2]/div[1]/div[2]/span[2]',
            text: 'beforeend',
            xpath: true
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, 'Nate Hopkinsbeforeend')
    })

    it('should execute multiple insertAdjacentText operations in sequence', () => {
      const dom = new JSDOM(
        `
      <div class="insert_adjacent_text" id="insert_adjacent_text-1">Nate Hopkins</div>
      <div class="insert_adjacent_text" id="insert_adjacent_text-2">Nate Hopkins</div>
      <div class="insert_adjacent_text" id="insert_adjacent_text-3">Nate Hopkins</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        insertAdjacentText: [
          {
            selector: '#insert_adjacent_text-1',
            text: 'beforeend'
          },
          {
            selector: '#insert_adjacent_text-2',
            text: 'beforeend'
          },
          {
            selector: '#insert_adjacent_text-3',
            text: 'beforeend'
          }
        ]
      }

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

      CableReady.perform(operations)

      assert.equal(beforeCount, 3)
      assert.equal(afterCount, 3)

      elements.forEach(element => {
        assert.equal(element.innerHTML, 'Nate Hopkinsbeforeend')
      })
    })
  })
})
