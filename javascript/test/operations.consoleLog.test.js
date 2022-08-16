import { html, fixture, assert } from '@open-wc/testing'
import sinon from 'sinon'

import { perform } from '../cable_ready'

describe('operations', () => {
  context('consoleLog', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should console log', async () => {
      const operations = [{ operation: 'consoleLog', message: 'Log' }]
      sinon.replace(console, 'log', sinon.fake())

      perform(operations)

      assert(console.log.calledWith('Log'))
    })

    it('should console log with explicit level', async () => {
      const operations = [
        { operation: 'consoleLog', message: 'Log', level: 'log' }
      ]
      sinon.replace(console, 'log', sinon.fake())

      perform(operations)

      assert(console.log.calledWith('Log'))
    })

    it('should console warn', async () => {
      const operations = [
        { operation: 'consoleLog', message: 'Warn', level: 'warn' }
      ]
      sinon.replace(console, 'warn', sinon.fake())

      perform(operations)

      assert(console.warn.calledWith('Warn'))
    })

    it('should console info', async () => {
      const operations = [
        { operation: 'consoleLog', message: 'Info', level: 'info' }
      ]
      sinon.replace(console, 'info', sinon.fake())

      perform(operations)

      assert(console.info.calledWith('Info'))
    })

    it('should console error', async () => {
      const operations = [
        { operation: 'consoleLog', message: 'Error', level: 'error' }
      ]
      sinon.replace(console, 'error', sinon.fake())

      perform(operations)

      assert(console.error.calledWith('Error'))
    })
  })
})
