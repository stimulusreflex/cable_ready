export default class SubscribingElement extends HTMLElement {
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
