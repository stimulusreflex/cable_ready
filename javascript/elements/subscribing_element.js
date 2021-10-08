import actionCable from '../action_cable'

export default class SubscribingElement extends HTMLElement {
  disconnectedCallback () {
    if (this.channel) this.channel.unsubscribe()
  }

  createSubscription (consumer, channel, receivedCallback) {
    this.channel = consumer.subscriptions.create(
      {
        channel,
        identifier: this.getAttribute('identifier')
      },
      {
        received: receivedCallback
      }
    )
  }

  consumer () {
    return actionCable.getConsumer()
  }

  get preview () {
    return (
      document.documentElement.hasAttribute('data-turbolinks-preview') ||
      document.documentElement.hasAttribute('data-turbo-preview')
    )
  }
}
