# Troubleshooting

## Verify ActionCable

If ActionCable isn't working properly in your environment, StimulusReflex cannot function.

Step one to any troubleshooting process should be "is it plugged in?"

First, run `rails generate channel test` in your Rails project folder. This will ensure that your ActionCable setup has been initialized, although you should verify that in your `app/javascript/packs/application.js` you have `import 'channels'` present.

Next, **copy and paste** the following into the two specified files, replacing their contents.

::: code-group
```ruby [app/channels/test_channel.rb]
class TestChannel < ApplicationCable::Channel
  def subscribed
    stream_from "test"
  end

  def receive(data)
    puts data["message"]
    ActionCable.server.broadcast("test", "ActionCable is connected")
  end
end
```

```javascript [app/javascript/channels/test_channel.js]
import consumer from './consumer'

consumer.subscriptions.create('TestChannel', {
  connected () {
    this.send({ message: 'Client is live' })
  },

  received (data) {
    console.log(data)
  }
})
```
:::

If ActionCable is running properly, you should see `ActionCable is connected` in your browser's Console Inspector and `Client is live` in your server's STDOUT log stream.

You can feel free to remove both of these files after you're done, but leave `app/javascript/channels/consumer.js` where it is so that all of your ActionCable channel subscribers can share one ActionCable connection.

## Consider disabling ActionCable logs

Once your app is properly configured and off to a good start, you might want to consider disabling ActionCable logging by setting the following in an initializer:

::: code-group
```ruby [config/initializers/action_cable.rb]
ActionCable.server.config.logger = Logger.new(nil)
```
:::

Not only is the ActionCable logger particularly verbose - especially when you're doing full-page morph operations - but it's widely understood to be a source of **mystery slowdowns**.

## Consider reading up on Redis, AnyCable and Heroku

There is an abundance of collected wisdom on the StimulusReflex [Deployment](https://docs.stimulusreflex.com/appendices/deployment) documentation page for developers who are working with ActionCable.

Another excellent resource is the [Sidekiq wiki page for Heroku](https://github.com/mperham/sidekiq/wiki/Heroku).

## Remote forms in Rails 6.1

The behaviour of form helpers changed slightly in Rails 6.1, as forms are no longer automatically set to be `remote: true` by default. This catches many developers off-guard!

We recommend that Rails developers use UJS/mrujs remote forms wherever possible, especially if they are using Turbolinks / Turbo Drive. This allows forms to be submitted without reloading the page, which is not only much faster (no more ugly screen refreshes!) but allows ActionCable Connections to remain open, too.

```html
<%= form_with model: @foo, local: false %>
<%= form_with model: @foo, data: { remote: "true" } %>
<%= form_for @foo, remote: true %>
<form action="/foo" data-remote="true" method="post"></form>
```

## Things to avoid doing, if possible

### Don't include `CableReady::Broadcaster` in a Reflex class 🙅‍♂️

TL;DR: there's some [awesome shortcuts](https://docs.stimulusreflex.com/guide/cableready#using-cableready-inside-a-reflex-action) for StimulusReflex developers to use CableReady to broadcast operations to the current user, but they come at the expense of introducing a gotcha. We think that they are totally worth it, but we still feel bad when folks occasionally lose time to this.

### Don't use CableReady from a standard Rails controller page action

... if the goal is to show the current user something new.

In Rails, the order of operations is Request -&gt; Controller Action -&gt; View Render -&gt; Response. If you broadcast a CableReady operation targeting the current user during the Controller Action phase, it will transmit to the browser and execute before the HTML has even been rendered. This leads to an unfortunate scenario where it appears that "nothing happened."

::: danger
Don't attempt to use `sleep` in your Controller Action to "slow down" a CableReady broadcast. Not only will this not work - the same problem will happen, slower - but freezing the Ruby thread means the application server has fewer resources to respond to other requests.

You never want to use `sleep` in a primary execution thread. Chances are, you should use an [ActiveJob](https://guides.rubyonrails.org/active_job_basics.html) with a delayed start.
:::

#### Ajax actions, webhooks and broadcasting to other people is fine

If your controller action has created an event that should be broadcast to multiple people, such as an event notification, it makes sense to broadcast that data as soon as it's relevant - ideally, via an ActiveJob so you can return your HTML faster.

Similarly, controller actions that don't initiate a navigation event (Ajax actions, webhooks, OAuth endpoints) are all fine to broadcast.

Note that if this group broadcast would modify the page state of the initiating user, the DOM generated by the Controller Action should reflect the new state as though you also received the broadcast. It's easier to **deliver perfect HTML** up front, rather than wasting time trying to receive an event on the client. See "[The Logical Splitter](/guide/leveraging-stimulus#example-3-the-logical-splitter)".

Architecturally, this is like throwing turd away before sprinting to try and catch it. 💩

### Don't perform purity rituals

There are some who have been trained to loudly reject what they see as violations of the barrier between business logic and presentation layer in their applications. Much like stop signs and poison labels, the intentions behind these constraints are almost always a really good idea. Most of the time, you should go with the program when it comes to things designed to keep you safe.

There are situations, however, whether the only rational decision is to consciously ignore the generalized advice and be confident that you can explain why you did so. Otherwise, you're just slave to a dogma.

A poignant example of this is the conundrum of an ActiveJob broadcasting HTML updates to the DOM. Which solution sounds sane to you?

1. ActiveJob uses CableReady to broadcast a [`dispatch_event`](/reference/operations/event-dispatch#dispatch-event) operation with a custom event name and resource id attached as `detail`. The event is picked up by a DOM element with a Stimulus controller which immediately calls `this.stimulate('Insane#hoop_jump', id)` which triggers a Selector Reflex that renders a partial and uses CableReady to send a `morph` operation which updates the DOM element.
2. ActiveJob uses CableReady to send a `morph` operation which updates the DOM element.

Don't be the person who performs a Server -&gt; Client -&gt; Server -&gt; Client ritual so that you can claim you kept your business logic separate from filthy presentation layer concerns. That's not architectural purity, it's wasting some of the time you have left before you die. ⏳

## radiolabel

If you have [Stimulus](/guide/leveraging-stimulus#installing-stimulus) running on your application, you should consider installing [radiolabel](https://github.com/leastbad/radiolabel). It is a Stimulus controller that watches for CableReady "after-_operation_" [events](/guide/working-with-cableready#listening-for-events). When it detects an operation that mutates an element, it will create a titled overlay which briefly announces when an element is modified.

[morph](/reference/operations/dom-mutations#morph) operations will be orange, while all others are green.

If you're doing a lot of DOM manipulation with CableReady, you'll find radiolabel to be indispensable.
