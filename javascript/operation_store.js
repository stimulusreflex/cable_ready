import Operations from './operations'

let operations = Operations

const add = newOperations => {
  operations = { ...operations, ...newOperations }
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
    return operations
  }
}
