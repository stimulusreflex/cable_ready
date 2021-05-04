import assert from 'assert'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'

import CableReady from '../cable_ready'

describe('operations', () => {
  context('consoleLog', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should console log', () => {
      const operations = { consoleLog: [{ message: 'Log' }] }
      sinon.replace(console, 'log', sinon.fake())

      CableReady.perform(operations)

      assert(console.log.calledWith('Log'))
    })

    it('should console log with explicit level', () => {
      const operations = { consoleLog: [{ message: 'Log', level: 'log' }] }
      sinon.replace(console, 'log', sinon.fake())

      CableReady.perform(operations)

      assert(console.log.calledWith('Log'))
    })

    it('should console warn', () => {
      const operations = { consoleLog: [{ message: 'Warn', level: 'warn' }] }
      sinon.replace(console, 'warn', sinon.fake())

      CableReady.perform(operations)

      assert(console.warn.calledWith('Warn'))
    })

    it('should console info', () => {
      const operations = { consoleLog: [{ message: 'Info', level: 'info' }] }
      sinon.replace(console, 'info', sinon.fake())

      CableReady.perform(operations)

      assert(console.info.calledWith('Info'))
    })

    it('should console error', () => {
      const operations = { consoleLog: [{ message: 'Error', level: 'error' }] }
      sinon.replace(console, 'error', sinon.fake())

      CableReady.perform(operations)

      assert(console.error.calledWith('Error'))
    })
  })
})
