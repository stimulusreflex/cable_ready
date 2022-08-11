import Operations from './operations'

window.CableReadyOperationsStore = Operations

const add = newOperations => {
  window.CableReadyOperationsStore = { ...window.CableReadyOperationsStore, ...newOperations }
}

const addOperations = operations => {
  add(operations)
}

const addOperation = (name, operation) => {
  const operations = {}
  operations[name] = operation

  add(operations)
}

export { addOperation, addOperations }

export default {
  get all () {
    return window.CableReadyOperationsStore
  },

  getAll() {
    return window.CableReadyOperationsStore
  }
}
