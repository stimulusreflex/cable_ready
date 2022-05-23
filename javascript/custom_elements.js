import { perform } from './cable_ready'

const camelize = (str) => str.replace(/[-_](.)/g, (_, group1) => {
  return group1.toUpperCase();
})

export class CableReadyOperationElement extends HTMLElement {
  connectedCallback() {
    const operationOptions = {}
    Array.from(this.attributes).forEach(attr => {
      if (!attr.name.startsWith('operation-')) {
        operationOptions[camelize(attr.name)] = JSON.parse(attr.value)
      }
    })

    const operation = {
      [camelize(this.getAttribute('operation-name'))]: [operationOptions]
    }

    perform(operation)

    this.remove()
  }
}

customElements.define('cable-ready-operation', CableReadyOperationElement)