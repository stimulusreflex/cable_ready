export default class SubscribingElement extends HTMLElement {
  static get tagName () {
    throw new Error('Implement the tagName() getter in the inheriting class')
  }

  static define () {
    if (!customElements.get(this.tagName)) {
      customElements.define(this.tagName, this)
    }
  }

  disconnectedCallback () {
    if (this.channel) this.channel.unsubscribe()
  }

  createSubscription (consumer, channel, receivedCallback) {
    this.channel = consumer.subscriptions.create(
      {
        channel,
        identifier: this.identifier
      },
      {
        received: receivedCallback
      }
    )
  }

  get preview () {
    return (
      document.documentElement.hasAttribute('data-turbolinks-preview') ||
      document.documentElement.hasAttribute('data-turbo-preview')
    )
  }

  get identifier () {
    return this.getAttribute('identifier')
  }
}
