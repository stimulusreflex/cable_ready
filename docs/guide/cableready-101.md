# Channels 101

While `cable_ready_stream_from` is great, there are many techniques _only_ possible if you leverage [ActionCable](/guide/action-cable#the-missing-manual) Connections, Channels and Subscriptions.

::: info
CableReady v5 introduced the `cable_ready_stream_from` view helper, which was covered in the previous [Hello World](/hello-world/hello-world) chapter.
:::

## So, what's a channel?

::: tip
There's an entire [chapter](/guide/action-cable#the-missing-manual) dedicated to explaining ActionCable, but this should be enough to get started. 😅
:::

An ActionCable [Channel](https://api.rubyonrails.org/v6.1.4/classes/ActionCable/Channel/Base.html) is a Ruby class you create with a goal in mind. Achieving that goal revolves around sending and receiving messages from a list of subscribers that are connected over WebSockets.

Channels define one or more unique identifiers. These are string patterns which map subscribers to Channels, similarly to how `routes.rb` maps request paths to Controllers. The way you structure these identifiers decides whether messages sent to the Channel are delivered to every subscriber, or just a subset that matches a given pattern.

On the client, you use an ActionCable Connection `consumer` to subscribe to Channels. The subscription provides access to data that is `received` from the server, as well as a mechanism for sending data to the sever.

The subscription attempt can _optionally_ include `params`, similar to POSTing a form to a controller action. The Channel class can access these `params` and use these values to compute and return a subscription identifier.

Don't worry if this sounds complicated, because we're going to create a Channel together, now.

## Basic Channel Setup

Use the Rails `channel` generator to create an ActionCable [Channel](https://guides.rubyonrails.org/action_cable_overview.html#terminology-channels) class called `ExampleChannel`. If this is the first time you've generated a Channel, a number of important files and folders will be created.

```bash
rails generate channel example
```

In this configuration, every client that subscribes to `ExampleChannel` will receive any broadcasts sent to to the identifier `visitors`. Operations broadcast there will be sent to everyone looking at your site. They will be automatically subscribed to your channel.

::: code-group
```ruby [app/channels/example_channel.rb]
class ExampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "visitors"
  end
end
```
:::

The generator also creates a JavaScript channel subscriber. Import `CableReady` and modify the `received` method to check incoming data for CableReady broadcasts.

::: code-group
```javascript [app/javascript/channels/example_channel.js]
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
})
```
:::

::: tip
Thanks to Turbo Drive / Turbolinks, subscriptions created in this manner will remain active until the user refreshes the page or leaves the site.
:::

## Broadcasting operations

Now that we have created a Channel, it's time to send commands to the client.

#### Make CableReady available

You can use CableReady almost anywhere in your application, so long as you include it in the class that you're working in:

```ruby
include CableReady::Broadcaster
```

::: tip
On the [CableReady Everywhere](/guide/cableready-everywhere) page, you'll learn how to broadcast from (pretty much) anywhere in your application.
:::

#### The 3 parts of a CableReady command

With few exceptions, all CableReady invocations have three predictable segments:

1. Stream identifier(s): who (or what) will receive operations
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

The `ExampleChannel` that you created will send any operations broadcast to `visitors` to all currently subscribed clients. In the code above, everyone on the site will see a Console Inspector message welcoming the latest member.

::: info
ActionCable can deduce `ExampleChannel` from `visitors` because only one Channel can stream from a given identifier. It is conceptually similar to Rails request routing, except that identifiers are defined inside of your Channel classes.
:::

## Queueing operations

CableReady maintains a queue of operations for every identifier. You can call `cable_ready` multiple times to add more operations to these queues.

`cable_ready` is a singleton instance, which means that you can keep adding operations to a queue across multiple method calls.

```ruby
cable_ready["visitors"]
  .console_log(message: "We have more salad than we can eat.")

cable_ready["visitors"]
  .set_style(selector: "body", name: "color", value: "red")
```

You can use different operations together, and each operation can have completely different options. The most common option is `selector`, which is how you identify the target DOM element(s) for an operation. In fact, it's so common that you can just pass it as the first parameter, without a key.

```ruby
cable_ready["visitors"]
  .set_style("#foo", name: "color", value: "blue")
```

Operations will continue to accumulate for all stream identifier queues until you call `broadcast`.

## Method chaining

When you call `cable_ready["visitors"]`, it returns a `CableReady::Channels` object, which supports method chaining. That is, you can link up as many operations in sequence as you want, and they will be broadcast in the order that they were created.

```ruby
cable_ready["visitors"]
  .console_log(message: "1")
  .console_log(message: "2")
```

The `broadcast` method concludes the chain. After the operations have been dispatched, the queues are emptied.

```ruby
cable_ready["visitors"]
  .console_log(message: "Welcome!")
  .broadcast
```

## Ready to rumble!

That's really all you need to get started with CableReady.

You can look over the next sections to learn more techniques, such as [broadcasting to resources](/guide/broadcasting-to-resources#stream-for-and-broadcast-to), or jump to the [Operations](/reference/operations/index) reference and see everything CableReady can do.

![](/hasselhoff.jpg)
