# ActionCable: It's Complicated

## The Missing Manual

The author has substantial empathy for any volunteers tasked with documenting abstract framework concepts, including the dozens of people who have contributed in varying degrees to the [Rails Guide for ActionCable](https://guides.rubyonrails.org/action_cable_overview.html). Still, as a tool for learning how to use ActionCable, it frustrates the reader along several axis and hasn't received the polish other Guides in the Rails framework have benefitted from.

The most unfortunate aspect of the ActionCable guide was the decision to frame the entire mental model around the apparent goal of implementing \[part of\] a chat system. **ActionCable is for building chat systems in the exact same way that Rails is for building blogs.** In fact, this paragraph is very intentionally the only time chat will be mentioned in the entirety of the CableReady documentation. It is realistic to conclude that the near-complete fixation on chat retarded the evolution of real-time interfaces and techniques in Rails by a period measured in years. 🤦‍♀️

`Connection` represents the fully-abstracted raw websocket protocol. Properly configured, one WS connection can support an unbound number of Channels, and it will work hard to keep you connected even if your bandwidth is spotty. Connections are also where most developers implement authentication.

`Channel` is a theme-specific conduit for exchanging messages via the Connection. These conduits are referenced by the developer using either a string or a constant. Channel is designed with a "hub-and-spoke" distribution model in which there is no concept of direct, client-to-client message passing. Implemented as a sibling pair of Ruby and JavaScript classes, Channel provides the flexible conceptual chassis upon which real-time applications can be built in Rails.

`Subscription` is a wire made out of intention, stretched between the firehose "stream" interfaces of the Channel and the densely connected tree your client-side code taps like a spigot. Subscriptions might not be free, but they certainly are quite cheap.

The thing about Channels and Subscriptions is that once you've established them, they only take up as much room as the content that you pass down them. They are a lattice of pneumatic tubes that only exist in the moment they are needed, and not a moment before or after.

To double-murder a metaphor, Channels are to classes what Subscriptions are to instances.

... and now you know how ActionCable works!

## Connection authentication

Since it's difficult to improve upon perfection, please consult the StimulusReflex documentation section on [authenticating users in ActionCable](https://docs.stimulusreflex.com/guide/authentication.html).

## Send data to any ActionCable Channel

There are times where it might be useful to send data directly to any clients subscribed to a given Channel stream identifier. It's even compatible with a CableReady performer since the data you send will (hopefully) not have a `cableReady` key present.

```ruby
ActionCable.server.broadcast("your-stream-identifier", data)
```

You can see this technique used in "[Verify ActionCable](/troubleshooting/#verify-actioncable)".

If you need to send data to a constant-based stream, you just need to break down the fourth wall and construct your identifier manually. Here we will send data to `current_user` using the `UsersChannel`:

```ruby
ActionCable.server.broadcast("users:#{current_user.to_gid_param}", data)
```

`UsersChannel` becomes `users` while ActiveRecord has a `to_gid_param`.

## Poking a subscriber

Sometimes you just need to tell a subscriber that it's time to _do the thing_. You can send a `broadcast` with no operations and still take advantage of the `received` handler:

```ruby
cable_ready["stream"].broadcast
```

```javascript
consumer.subscriptions.create('ChewiesChannel', {
  received (data) {
    console.log('Received a broadcast!')
  }
})
```

## Disconnect a user from their ActionCable Connection

As you can see in the upcoming section on [connection identifiers](/guide/stream-identifiers#stream-identifiers-from-accessors), ActionCable Connections can designate that they are able to be `identified_by` one or more objects. These can be strings or ActiveRecord model resources. It is **only** using one of these connection identifiers that you can forcibly disconnect a client connection entirely.

Forcing a websocket reconnection is mainly useful for upgrading account privileges after successfully authenticating. You could also disconnect former employees after they've been terminated.

TODO: update to recommend client-side solution

This is going to look a lot like an ActiveRecord finder, but it's a trap! _This is no such thing._ The only thing it can look up are connection identifiers that have already been defined on the Connection class. You need a valid resource reference (i.e. a user that is actually connected) to get a match on the ActionCable `remote_connections` mapping. Otherwise, the following will simply fail silently:

```ruby
ActionCable.server
  .remote_connections
  .where(current_user: User.find(1))
  .disconnect
```

The ActionCable Channel subscriber will immediately start attempting to reconnect to the server, with the usual connection retry rate fall-off curve, just as if you restarted your Puma process.

### Disconnecting when you have multiple identifiers

It's not clear whether this is a bug or a feature, but ActionCable will not allow you to disconnect a user if your Connection has any identifiers which haven't been assigned. Specifically, if you have configured your Connection to be `identified_by` both `current_user` and `session_id`, it will raise an error if your user hasn't authenticated yet. That's no good!

Our suggestion is that you **fix ActionCable** with this initializer, which changes line 6 from `all?` to `any?`

```ruby [config/initializers/action_cable.rb]
module ActionCable
  class RemoteConnections
    class RemoteConnection
      def valid_identifiers?(ids)
        keys = ids.keys
        identifiers.any? { |id| keys.include?(id) }
      end
    end
  end
end
```
