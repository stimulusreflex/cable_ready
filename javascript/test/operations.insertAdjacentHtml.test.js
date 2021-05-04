import assert from 'assert'
import refute from './refute'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('operations', () => {
  context('insertAdjacentHtml', () => {
    it('should insert adjacent html beforeend', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_html"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_html')
      const operations = {
        insertAdjacentHtml: [
          {
            selector: '#insert_adjacent_html span',
            html: '<span>beforeend</span>'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>Nate Hopkins<span>beforeend</span></span>'
      )
    })

    it('should insert adjacent html afterbegin', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_html"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_html')
      const operations = {
        insertAdjacentHtml: [
          {
            selector: '#insert_adjacent_html span',
            html: '<span>afterbegin</span>',
            position: 'afterbegin'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(
        element.innerHTML,
        '<span><span>afterbegin</span>Nate Hopkins</span>'
      )
    })

    it('should insert adjacent html beforebegin', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_html"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_html')
      const operations = {
        insertAdjacentHtml: [
          {
            selector: '#insert_adjacent_html span',
            html: '<span>beforebegin</span>',
            position: 'beforebegin'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>beforebegin</span><span>Nate Hopkins</span>'
      )
    })

    it('should insert adjacent html afterend', () => {
      const dom = new JSDOM(
        '<div id="insert_adjacent_html"><span>Nate Hopkins</span></div>'
      )
      global.document = dom.window.document

      const element = document.querySelector('#insert_adjacent_html')
      const operations = {
        insertAdjacentHtml: [
          {
            selector: '#insert_adjacent_html span',
            html: '<span>afterend</span>',
            position: 'afterend'
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(
        element.innerHTML,
        '<span>Nate Hopkins</span><span>afterend</span>'
      )
    })

    it('should insert adjacent html for multiple elements', () => {
      const dom = new JSDOM(
        `
      <div class="insert_adjacent_html">Nate Hopkins</div>
      <div class="insert_adjacent_html">Nate Hopkins</div>
      <div class="insert_adjacent_html">Nate Hopkins</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        insertAdjacentHtml: [
          {
            selector: '.insert_adjacent_html',
            html: '<span>beforeend</span>',
            selectAll: true
          }
        ]
      }
      const elements = document.querySelectorAll('.insert_adjacent_html')

      assert.equal(elements.length, 3)

      CableReady.perform(operations)

      elements.forEach(element => {
        assert(element)
        assert.equal(element.innerHTML, 'Nate Hopkins<span>beforeend</span>')
      })
    })

    it('should insert adjacent html for XPath element', () => {
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
        insertAdjacentHtml: [
          {
            selector: '/html/body/div/div[2]/div[1]/div[2]/span[2]',
            html: '<span>beforeend</span>',
            xpath: true
          }
        ]
      }

      CableReady.perform(operations)

      assert.equal(element.innerHTML, 'Nate Hopkins<span>beforeend</span>')
    })

    it('should execute multiple insertAdjacentHtml operations in sequence', () => {
      const dom = new JSDOM(
        `
      <div class="insert_adjacent_html" id="insert_adjacent_html-1">Nate Hopkins</div>
      <div class="insert_adjacent_html" id="insert_adjacent_html-2">Nate Hopkins</div>
      <div class="insert_adjacent_html" id="insert_adjacent_html-3">Nate Hopkins</div>
      `
      )
      global.document = dom.window.document

      const operations = {
        insertAdjacentHtml: [
          {
            selector: '#insert_adjacent_html-1',
            html: '<span>beforeend</span>'
          },
          {
            selector: '#insert_adjacent_html-2',
            html: '<span>beforeend</span>'
          },
          {
            selector: '#insert_adjacent_html-3',
            html: '<span>beforeend</span>'
          }
        ]
      }

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

      CableReady.perform(operations)

      assert.equal(beforeCount, 3)
      assert.equal(afterCount, 3)

      elements.forEach(element => {
        assert.equal(element.innerHTML, 'Nate Hopkins<span>beforeend</span>')
      })
    })
  })
})
