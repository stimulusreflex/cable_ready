---
description: "Become an identifier wizard \U0001F9D9"
---

# Stream Identifiers

{% hint style="info" %}
From this point forward, many code samples will show CableReady operation methods being used without any parameters. This is intended as a visual shorthand which can simplify examples and keep the reader in the flow of the concept being explained.

In practice, [all CableReady operations](reference/operations/) require at least one method to be used properly.
{% endhint %}

## Queues

When you add an operation, you're adding an entry to a FIFO queue of operations for a given stream identifier:

```ruby
cable_ready["visitors"].morph
```

If your app has multiple stream identifiers, it means that you have two different queues that you can add to:

```ruby
cable_ready["sailors"].inner_html
cable_ready["visitors"].set_style
```

{% hint style="info" %}
As we learned back in [Hello World](hello-world.md), ActionCable Channel classes announce stream identifiers using the `stream_from` and `stream_for` methods.

**Each identifier can only be attached to one Channel.**
{% endhint %}

Now, you have "visitors" with two operations, and "sailors" with one, both waiting patiently to be [broadcast](reference/methods.md#broadcast-identifiers-clear-true):

```ruby
cable_ready.broadcast
```

Great: the operations in both queues have been delivered, and they are empty again. Each queue is sent to the client with its own broadcast, but each broadcast can contain many operations from the same queue.

{% hint style="success" %}
Every CableReady method chain starts with a declared identifer, by way of the `[]` characters that suffix the `cable_ready` method.
{% endhint %}

What if you'd wanted to send all of those operations multiple times, though? You can, if you pass `clear: false` as the last [parameter](reference/methods.md#broadcast-identifiers-clear-true) to `broadcast`:

```ruby
cable_ready["sailors"].console_log
cable_ready["visitors"].insert_adjacent_text
cable_ready.broadcast(clear: false)
cable_ready.broadcast(clear: false)
cable_ready["sailors"].dispatch_event
cable_ready.broadcast
```

Congrats, you have just sent six separate broadcasts; three for each queue. And on the very last pair of broadcasts, the "sailors" queue contained two operations - `console_log` and `dispatch_event` - instead of just `console_log`.

What if you have a whole bunch of queues for different streams on the go, and you don't want to broadcast them all at once? What if you just want to broadcast to "sailors"?

![&quot;sailors&quot;](.gitbook/assets/sailors.jpg)

```ruby
cable_ready["sailors"].push_state
cable_ready["visitors"].set_style          # still pending after broadcast
cable_ready["chewies"].remove_storage_item # still pending after broadcast
cable_ready.broadcast("sailors")
```

The "sailors" queue is now empty, while the "visitors" and "chewies" queues are still waiting, and still accumulating new operations.

Let's build a slightly more involved - but no less silly - example:

```ruby
cable_ready["sailors"].text_content
cable_ready["visitors"].set_focus
cable_ready["chewies"].remove_css_class
cable_ready.broadcast("visitors", "chewies", clear: false) # visitors, chewies
cable_ready.broadcast("chewies", clear: false)             # chewies     
cable_ready.broadcast("visitors")                          # visitors
cable_ready.broadcast                                      # sailors, chewies
```

This resulted in six broadcasts, total: "visitors", "chewies", "chewies", "visitors", "sailors", "chewies".

If you put your [broadcast](reference/methods.md#broadcast-identifiers-clear-true) call on the end of a method chain that has already specified an identifier, you cannot modify the identifier further in your `broadcast` call:

```ruby
cable_ready["chewies"].set_cookie.broadcast("sailors") # ERROR! identifier is already "chewies"
```

## Multiple identifiers

It's possible to configure your Channel to "stream from" multiple stream identifiers at once:

```ruby
class ChewiesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "mike"
    stream_from "ike"
  end
end
```

From the client subscriber's perspective, this makes no difference.

On the server, it means that this Channel has two entries in the ActionCable "routing table". Both of the following broadcasts will go to the same subset of users:

```ruby
cable_ready["mike"].morph.broadcast
cable_ready["ike"].morph.broadcast
```

Each stream identifier has its own operations queue. This means that you could build up two queues of different operations, both intended for the same recipient\(s\) but broadcasting at different times.

## Dynamic identifiers

Until now, we've been [working with](hello-world.md) Channels that have "glob" identifiers. Everyone subscribing to the Channel can be reached by broadcasting to it's identifier. Time to level up!

The argument to `stream_from` is \[just\] a string, which means that we can construct all manner of dynamic identifiers based on information available to us from the Channel and Connection, as well as a `params` hash that comes from the client when the Channel subscription is received.

The `params` you get from an ActionCable Channel subscription request is conceptually similar to what you get from a typical ActionDispatch controller request. They do not go through the Rails router, however, and they are only for Channel subscriptions.

Consider this `ApplicationCable` definition, which supports Devise authentication but falls back on `request.session.id` so that nobody is turned away:

{% code title="app/channels/application\_cable/connection.rb" %}
```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user
    identified_by :session_id

    def connect
      self.current_user = env["warden"].user
      self.session_id = request.session.id
      reject_unauthorized_connection unless self.current_user || self.session_id
    end
  end
end
```
{% endcode %}

{% hint style="info" %}
In the above scenario, you might consider [forcing a reconnect]() when the user successfully logs into their account so that the Connection correctly ties their actions to the correct account.
{% endhint %}

We now have a number of options for crafting our `stream_from` string.

### Stream identifiers from accessors

We can interrogate the Connection to see what Connection identifiers are available to us for some exciting meta-programming possibilities:

```ruby
connection.identifiers
=> #<Set: {:current_user, :session_id}>
```

{% hint style="warning" %}
Don't shoot the messenger: ActionCable has "Connection identifiers" \(in this case, `:current_user` and `:session_id`\) which refer to the objects defined in `connection.rb` using `identified_by` directives **AND** Channel stream identifiers, which are the mailboxes/routing channels we broadcast to with CableReady \(e.g. "sailors"\). 🤦‍♀️
{% endhint %}

Two Connection identifiers means two accessors available to us: `session_id` and `current_user`:

```ruby
session_id
=> "377f97791adae1f36be2a106498d8401"
current_user.login
=> "leastbad"
```

This means that you can set up your Channel stream identifier to support broadcasting to any registered user, assuming that you know their user\_id \(and they are online at the time\):

```ruby
class SailorChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sailor:#{current_user.id}"
  end
end
```

### Stream identifiers with logic

Perhaps we want to be able to broadcast to everyone currently looking at the site \("visitors"\), people who haven't yet signed up \("landlubbers"\) and, of course, "sailors". We can accomplish this by making a decision based on whether there is a `current_user` in scope:

{% code title="app/channels/sailor\_channel.rb" %}
```ruby
class SailorChannel < ApplicationCable::Channel
  def subscribed
    stream_from current_user ? "sailors" : "landlubbers"
  end
end
```
{% endcode %}

{% hint style="info" %}
ActionCable can later map between ExampleChannel \("visitors"\) and SailorChannel \("sailors" and "landlubbers"\) because an identifier can only be attached to the first Channel that uses it.
{% endhint %}

### Stream identifiers from params

Let's imagine for a moment that in your new application, authenticated users are given a salty sailor nickname, which is stored in a `meta` tag with the name `nickname`. Anonymous visitors to the site have not yet had an opportunity to be given a salty sailor nickname.

{% hint style="info" %}
You can clone a copy of [this token authentication application](https://github.com/leastbad/stimulus_reflex_harness/tree/token_auth) and see a great example of how passing params works. A JWT token is created, stored in a `meta` tag in the `head`, then passed to the Channel subscription as a 2nd parameter.
{% endhint %}

We've [already seen](hello-world.md) that the subscription creation method accepts a string like "ExampleChannel". Behind the scenes, that string is converted into an object:

```javascript
{channel: "ExampleChannel"}
```

If you pass an object, it's assumed that one of the keys will be `channel` and the value will be the name of the channel. An arbitrary number of additional key/value pairs can _also_ be passed, and that's how we tell the server about our nickname \(which will be blank if it hasn't been set\).

```javascript
consumer.subscriptions.create(
  {
    channel: 'SailorChannel',
    nickname: document.querySelector('meta[name=nickname]').content
  },
  {
    connected () {},
    rejected () {},
    received (data) { if (data.cableReady) CableReady.perform(data.operations) }
  }
)
```

In our Channel class, we can now treat the object passed as a `params` hash:

{% code title="app/channels/sailor\_channel.rb" %}
```ruby
class SailorChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sailor:#{params[:nickname]}"
  end
end
```
{% endcode %}

In conclusion, ActionCable gives you the ability to create stream identifiers for one user, all users, and any ad hoc group in between. So long as the composition has a predictable structure, you have total control over who gets which broadcasts, under which circumstances.

But what if you don't want to broadcast operations to _people_? What if you want to broadcast operations to concepts and ideas? To _things_?

To **resources**? Read on...

