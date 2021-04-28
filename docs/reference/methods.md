# Methods

`broadcast` and `broadcast_to` immediately transmit all pending operations to subscribed ActionCable clients. Both methods can be called on an existing instance of `CableReady::Channels` or as the conclusion to a method chain.

```ruby
cable_ready["MyIdentifier"] # CableReady::Channels instance, string identifier
cable_ready[UserChannel] # constant identifier, used to broadcast_to a resource
```

While data transmission is handled by ActionCable, the client-side [channel subscriber](../setup.md#setup) must be configured to pass the received data to the CableReady client.

The default behavior of CableReady is to clear the operation queues for all streams immediately after delivering them. However, the developer can pass `clear: false` as the last keyword parameter to prevent clearing the queue. Not clearing the operations queue leaves it available for potential future `broadcast` methods to repeat.

|  | String identifier | Constant identifier \(for resources\) |
| :--- | :--- | :--- |
| channel setup | stream\_from "cookies" | stream\_for Cookie.find\(params\[:id\]\) |
| identifier | cable\_ready\["cookies"\] | cable\_ready\[CookiesChannel\] |
| send to client | broadcast | broadcast\_to\(cookie\) |

## broadcast\(\*identifiers, clear: true\)

This method operates on Channels which use the `stream_from` method in their `subscribed` method. `broadcast` is most frequently called with no arguments, which instructs CableReady to send one ActionCable payload for every string-based stream identifier with pending operations.

```ruby
cable_ready.broadcast # deliver all pending operations with string identifiers
```

The developer is able to constrain the outcome by passing one \(or several\) identifiers to the method. Specifying identifiers empowers CableReady to temporarily ignore any queues associated with unspecified identifiers.

```ruby
cable_ready["FirstIdentifier"].console_log(message: "gnarly!")
cable_ready["SecondIdentifier"].console_log(message: "rad!")
cable_ready["ThirdIdentifier"].console_log(message: "bodacious!")
cable_ready.broadcast("FirstIdentifier", "SecondIdentifier")
cable_ready.broadcast # sends third payload
```

Calling `broadcast` with no parameters delivers all queues identified by strings while ignoring any queues identified by constants.

{% hint style="info" %}
If `broadcast` is called at the end of a method chain, there is no opportunity to change the identifier. In this context, `broadcast` only accepts the optional `clear: false` boolean argument.
{% endhint %}

## broadcast\_to\(model, \*identifiers, clear: true\)

This method operates on Channels which use the `stream_for` method in their `subscribed` method. `broadcast_to` is most frequently called with its single mandatory argument, which is an instance of an ActiveRecord model. This instructs CableReady to send one ActionCable payload for every constant-based stream identifier with pending operations.

```ruby
cable_ready[PostsChannel].morph(...)
cable_ready.broadcast_to(Post.find(1))

cable_ready[UserChannel].dispatch_event(...)
cable_ready.broadcast_to(current_user)
```

Similar to the `broadcast` method, the developer _can_ deliver multiple constant-based identifiers, or constain the call to a subset. However, while we don't want to be prescriptive, the nature of the resource-driven functionality and the patterns it enables means that most applications using constant-based identifiers will likely be used in a 1:1 channel-to-broadcast capacity. _It's actually difficult to come up with a realistic example:_

```ruby
cable_ready[PostsChannel].dispatch_event(...)
cable_ready[CommentsChannel].dispatch_event(...)
cable_ready[VotesChannel].inner_html(...)
cable_ready.broadcast_to(Post.find(1), PostsChannel, CommentsChannel)
cable_ready.broadcast_to(Comment.find(1)) # sends to VotesChannel
```

Calling `broadcast_to` with only an ActiveRecord model parameter delivers all queues identified by constants while ignoring any queues identified by strings.

{% hint style="info" %}
If `broadcast_to` is called at the end of a method chain, there is no opportunity to change the identifier. In this context, `broadcast_to` accepts only `model` and the optional `clear: false` boolean argument.
{% endhint %}

## dom\_id\(record, prefix = nil\)

Every class which includes `CableReady::Broadcaster` has access to a special, server-side version of the [Rails dom\_id helper](https://apidock.com/rails/ActionView/RecordIdentifier/dom_id). Whereas the view helper is typically used to generate `id` values for rendering DOM elements which map cleanly to ActiveRecord model instances, this method is intended to generate CSS selector strings used by CableReady to locate those DOM elements.

This is **functionally identical to the view template version except that it prefixes the generated string with `#`** so that it can be passed directly to `document.querySelector()` on the client. This syntactic sugar means you can use a clever DSL instead of ugly string concatenations.

This method is automatically available in all StimulusReflex Reflex classes. This means that you can deploy some [extreme](https://www.youtube.com/watch?v=FO2Abp0FbA0)ly sexy morph Reflexes:

```ruby
class PostsReflex < ApplicationReflex
  def latest
    post = Post.last
    # no need to write ugly "#post_#{post.id}"
    morph dom_id(post), render(post)
  end
end
```

