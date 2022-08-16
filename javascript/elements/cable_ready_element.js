import { perform } from '../cable_ready'

export default class CableReadyElement extends HTMLElement {
  static define () {
    if (!customElements.get('cable-ready')) {
      customElements.define('cable-ready', this)
    }
  }

  connectedCallback () {
    setTimeout(() => {
      try {
        const operations = JSON.parse(this.scriptElement.textContent)
        perform(operations)
      } catch (error) {
        console.error(error)
      } finally {
        try {
          this.remove()
        } catch {}
      }
    })
  }

  get scriptElement () {
    if (
      this.firstElementChild instanceof HTMLScriptElement &&
      this.firstElementChild.getAttribute('type') === 'application/json'
    ) {
      return this.firstElementChild
    }
    throw new Error(
      'First child element in a `<cable-ready>` tag must be `<script type="application/json">`.'
    )
  }
}
