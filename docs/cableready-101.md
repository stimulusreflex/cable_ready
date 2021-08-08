# Channels 101

CableReady v5 introduces the new `stream_from` helper, which was covered in the previous [Hello World](hello-world.md) chapter. While `stream_from` is the fastest way to start broadcasting operations, they intentionally lack the flexibility and customization possible with an ActionCable Channel class and client consumer.

What follows is a brief tutorial that will get you up-and-running with using Channels.

## Basic Channel Setup

Use the Rails `channel` generator to create an ActionCable [Channel](https://guides.rubyonrails.org/action_cable_overview.html#terminology-channels) class called `ExampleChannel`. If this is the first time you've generated a Channel, a number of important files and folders will be created.

```bash
rails g channel example
```

In this configuration, every client that subscribes to `ExampleChannel` will receive any broadcasts sent to to a stream called `visitors`. We'll talk more about streams soon. For now, `visitors` is for operations that will be sent to everyone currently looking at your site.

{% code title="app/channels/example\_channel.rb" %}
```ruby
class ExampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "visitors"
  end
end
```
{% endcode %}

The generator also creates a JavaScript channel subscriber. Import `CableReady` and modify the `received` method to check incoming data for CableReady broadcasts.

{% code title="app/javascript/channels/example\_channel.js" %}
```javascript
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
})
```
{% endcode %}

## Broadcasting operations

Now that we have installed the library, verified its dependencies and created an ActionCable Channel in our app, it's time to actually make the magic happen.

#### Make CableReady available

You can use CableReady almost anywhere in your application, so long as you include it in the class that you're working in:

```ruby
include CableReady::Broadcaster
```

{% hint style="success" %}
On the [CableReady Everywhere](cableready-everywhere.md) page, you'll learn how to broadcast from \(pretty much\) anywhere in your application.
{% endhint %}

#### The 3 parts of a CableReady command

With few exceptions, all CableReady invocations have three predictable segments:

1. Stream identifier\(s\): who \(or what\) will receive operations
2. Operation queueing: one or more operations to broadcast
3. Broadcast: deliver all queued operations immediately

```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  after_create do
    cable_ready["visitors"] # send to everyone subscribed to the channel streaming from "visitors"
      .console_log(message: "Welcome #{self.name} to the site!") # all users will see a message appear in their browser's Console Inspector
      .broadcast # send all queued operations to all ExampleChannel subscribers
  end
end
```

{% hint style="info" %}
The `ExampleChannel` that we created in the [Setup](hello-world.md) will send any operations broadcast to `visitors` to all currently subscribed clients. In the code above, everyone on the site will see a Console Inspector message welcoming the latest member.

ActionCable can deduce `ExampleChannel` from `visitors` because only one Channel can stream from a given identifier. It is conceptually similar to Rails request routing, except that Strean Identifiers are defined inside of your Channel classes.
{% endhint %}

## Queueing operations

Each stream identifier has a queue of operations. You can call `cable_ready` multiple times to add more operations to these queues. Since `cable_ready` is a singleton instance, you can continue to add operations to a queue even across multiple methods:

```ruby
cable_ready["visitors"].console_log(message: "We have more salad than we can eat.")
cable_ready["visitors"].set_style(selector: "body", name: "color", value: "red")
```

You can use different operations together, and each operation can have completely different options. The most common option is `selector`, which is how you identify the target DOM element\(s\) for an operation. In fact, it's so common that you can just pass it as the first parameter, without a key.

```ruby
cable_ready["visitors"].set_style("#foo", name: "color", value: "blue")
```

Operations will continue to accumulate for all stream identifier queues until you call `broadcast`.

## Method chaining

When you call `cable_ready["visitors"]`, it returns a `CableReady::Channels` object, which supports method chaining. That is, you can link up as many operations in sequence as you want, and they will be broadcast in the order that they were created.

```ruby
cable_ready["visitors"].console_log(message: "1").console_log(message: "2")
```

The `broadcast` method concludes the chain. After the operations have been dispatched, the queues are emptied.

```ruby
cable_ready["visitors"].console_log(message: "Welcome!").broadcast
```

## Ready to rumble!

And that's really all you need to get started with CableReady.

You can look over the next sections to learn more techniques, such as [broadcasting to resources](broadcasting-to-resources.md#stream_for-and-broadcast_to), or jump to the [Operations](reference/operations/) reference to see everything CableReady can do.

![](.gitbook/assets/hasselhoff.jpg)

