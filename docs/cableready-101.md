# CableReady 101

Now that we have installed the library, verified its dependencies and created an ActionCable Channel in our app, it's time to actually make the magic happen.

You can send CableReady broadcasts from [just about anywhere](cableready-everywhere.md) in your application: ActiveJobs, controller actions, ActiveRecord model callbacks, rake tasks, pub/sub workers, webhooks, you name it.

We're going to use an ActiveRecord `after_create` callback to demonstrate welcoming a new user.

## Broadcasting operations

There are three distinct aspects of every CableReady invocation:

1. Channel stream identifier\(s\): decide who \(or what\) will receive operations
2. Operation queueing: define one or more operations to broadcast
3. Broadcast: broadcast all queued operations immediately

```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  after_create do
    cable_ready["visitors"].console_log(message: "Welcome #{self.name} to the site!")
    cable_ready.broadcast # send queued console_log operation to all ExampleChannel subscribers
  end
end
```

The `ExampleChannel` that we created in the [Setup](setup.md) will send any operations broadcast to `visitors` to all currently subscribed clients. In the code above, everyone on the site will see a Console Log message welcoming the latest member.

On the [Working with CableReady](usage.md#lets-get-comfortable) page, we'll see how we can set up CableReady so that you can access it from anywhere in your application, so that you don't have to include the module in every class.

{% hint style="info" %}
ActionCable can deduce `ExampleChannel` from `visitors` because only one Channel can stream from a given identifier. It is conceptually similar to Rails request routing, except that resolution possibilities are defined across all of your Channel classes.
{% endhint %}

You can call `cable_ready` multiple times to add more operations to the queue. Since `cable_ready` is a singleton instance, you can continue to add operations to the queue even across multiple methods, or a recursive function.

```ruby
cable_ready["visitors"].console_log(message: "We have more salad than we can eat.")
cable_ready["visitors"].set_style(selector: "body", name: "color", value: "red")
cable_ready["visitors"].set_style("#foo", name: "color", value: "blue")
```

You can use different operations together, and each operation can have completely different options. The most common option is `selector`, which is where you identify the target DOM element\(s\) for an operation. In fact, it's so common that you can just pass it as the first parameter, without a key.

Without a call to `broadcast`, operations will accumulate for the specified Channel stream identifier.

## Method chaining

When you call `cable_ready["visitors"]` you are presented with a `CableReady::Channels` object, which supports method chaining. This is a fancy way of saying that you can link up as many operations in sequence as you want, and they will ultimately be broadcast in the order that they were created.

```ruby
cable_ready["visitors"].console_log(message: "1").console_log(message: "2")
```

The `broadcast` method can conclude the chain, meaning that you can send a console message to everyone looking at your site with:

```ruby
cable_ready["visitors"].console_log(message: "Welcome!").broadcast
```

## Ready to rumble!

And that's really all you need to get started with CableReady. Everything you do will follow the same basic structure:

`cable_ready[identifier].operation().broadcast`

You can look over the next sections to learn more techniques, such as [broadcasting to resources](broadcasting-to-resources.md#stream_for-and-broadcast_to), or jump to the [Operations](reference/operations/) reference to see everything CableReady can do.

![](.gitbook/assets/hasselhoff.jpg)

