# Working with CableReady

## ActionCable: The Missing Manual

The author has substantial empathy for any volunteers tasked with documenting abstract framework concepts, including the dozens of people who have contributed in varying degrees to the [Rails Guide for ActionCable](https://guides.rubyonrails.org/action_cable_overview.html). Still, as a tool for learning how to use ActionCable, it frustrates the reader along several axis and hasn't received the polish other Guides in the Rails framework have benefitted from.

The most unfortunate aspect of the ActionCable guide was the decision to frame the entire mental model around the apparent goal of implementing \[part of\] a chat system. **ActionCable is for building chat systems in the exact same way that Rails is for building blogs.** In fact, this paragraph is very intentionally the only time chat will be mentioned in the entirety of the CableReady documentation. It is realistic to conclude that the near-complete fixation on chat retarded the evolution of real-time interfaces and techniques in Rails by a period measured in years. 🤦‍♀️

`Connection` represents the fully-abstracted raw websocket protocol. Properly configured, one WS connection can support an unbound number of Channels, and it will work hard to keep you connected even if your bandwidth is spotty. Connections are also where most developers implement authentication.

`Channel` is a theme-specific conduit for exchanging messages via the Connection. These conduits are referenced by the developer using either a string or a constant. Channel is designed with a "hub-and-spoke" distribution model in which there is no concept of direct, client-to-client message passing. Implemented as a sibling pair of Ruby and JavaScript classes, Channel provides the flexible conceptual chassis upon which real-time applications can be built in Rails.

`Subscription` is a wire made out of intention, stretched between the firehose "stream" interfaces of the Channel and the densely connected tree your client-side code taps like a spigot. Subscriptions might not be free, but they certainly are quite cheap.

The thing about Channels and Subscriptions is that once you've established them, they only take up as much room as the content that you pass down them. They are a lattice of pneumatic tubes that only exist in the moment they are needed, and not a moment before or after.

To double-murder a metaphor, Channels are to classes what Subscriptions are to instances.

... and now you know how ActionCable works!

## Single Source of Truth

CableReady was created with a deep and informed belief that web[ applications that maintain state on the server are fundamentally easier to design, build and maintain](advocating-for-reactive-rails.md).

However, one of the stranger edge-cases that must be handled in a websockets-enabled world is the potential for a server update to overwrite the value of a text input _while the user is typing into it_. It's a jarring example because it's an end-result that was almost completely impossible to achieve in the Ajax era. Despite our wildest brainstorms, we have yet to identify even a single scenario where a user would consider having their effort undone to be positive.

As a result, CableReady's popular [morph](reference/operations/dom-mutations.md#morph) operation comes pre-installed with a [shouldMorph callback](customization.md#shouldmorph-callbacks) called `verifyNotMutable` that actively prevents the server from overwriting input, textarea and select elements while they are active \(have focus\).

Since forms are rarely designed to be edited by multiple concurrent users 😱 it's unlikely that you'll have to spend time thinking about this issue. If you're one of the lucky ones, you can use CableReady and StimulusReflex to establish a field-level locking system, or at the very least, update CSS or nearby indicators to show that a particular input is locked, contested or potentially out of date.

## Selectors

By default, the `selector` string argument to DOM-mutating CableReady operations expects a CSS selector that resolves to **one** single DOM element.

If multiple elements can be returned, only the first one is used.

### xPath

CableReady also supports the use of [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) query expressions to locate elements based on their location relative to the document root in the DOM hierarchy. 🗺️

To interpret a selector as an XPath query, you need to do two things:

1. Pass `xpath: true` as a parameter argument when enqueueing the operation.
2. Provide an XPath query that matches the desired element, and then ensure its validity until the operation has completed.

Here's a function that can produce an XPath expression for any DOM element:

```javascript
const elementToXPath = element => {
  if (element.id !== '') return "//*[@id='" + element.id + "']"
  if (element === document.body) return '/html/body'

  let ix = 0
  const siblings = element.parentNode.childNodes

  for (var i = 0; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling === element) {
      const computedPath = elementToXPath(element.parentNode)
      const tagName = element.tagName.toLowerCase()
      const ixInc = ix + 1
      return `${computedPath}/${tagName}[${ixInc}]`
    }

    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++
  }
}
```

An XPath-powered operation might look like:

```ruby
cable_ready["stream"]
  .text_content(
    selector: "/html/body/div[3]/div[1]/article[1]/section[5]/ul[1]/li[10]/div[1]/div[2]",
    xpath: true,
    text: "XPath is under-utilized, but beware of side-effects changing your DOM."
  ).broadcast
```

{% hint style="success" %}
You can grab the XPath selector for any element using your browser's Element Inspector. Activate the desired element, right-click and select "Copy", then "Copy full XPath".
{% endhint %}

## Life-cycle events

Most CableReady operations emit a DOM [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) immediately before an operation is executed, and another immediately after.

They will be emitted from the `selector` element if present, otherwise they will default to `document`.

The event names follow a predictable pattern, as seen with `cable-ready:before-inner-html` and `cable-ready:after-morph`.

These events bubble and can be cancelled.

If jQuery is detected on the current page, jQuery events will be [triggered](https://api.jquery.com/trigger/) immediately after the DOM events. These jQuery events have the same name and `detail` accessors as their DOM event siblings.

A small number of operations, such as [dispatch\_event](reference/operations/event-dispatch.md#dispatch_event) and [console\_log](reference/operations/notifications.md#console_log), do not emit events. It's up to you to make sure that any [custom operations](customization.md#custom-operations) you create raise events, if desired.

{% hint style="info" %}
Don't confuse Life-cycle events emitted by operations with the [dynamically defined events](leveraging-stimulus.md#dispatched-event-listener-controllers) you can send using dispatch\_event operations. The ways you can capture them are the same, but Life-cycle events are part of the CableReady library behaviour whereas dispatched events are ad hoc and not constrained to CableReady operations.
{% endhint %}

### Listening for events

You can create a callback function to handle the life-cycle events CableReady emits, and then register that callback as an [event listener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) without any [special tools](leveraging-stimulus.md).

Create **named functions** \(and avoid anonymous functions\) for your callbacks because it's impossible to [remove](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) an event listener with an anonymous callback.

```ruby
const afterMorphHandler = event => { console.log(event.detail) }
document.addEventListener('cable-ready:after-morph', afterMorphHandler)
```

Once you have captured an event, you can inspect the `detail` object to access all of the options passed to CableReady when the operation was enqueued.

### Passing extra data

Since arbitrary JSON-compatible data that you pass when adding an operation will be available on the client via `detail`, you can use operations send extra information such as [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)s and even rendered bits of HTML to the client.

In general, it's easier to track related concepts transactionally in one broadcast envelope than it is to assemble data from multiple broadcasts back into a coherent state.

### Avoid long-running before-operation events

CableReady does not \(and could not\) wait for event listeners to finish running before launching the primary function of any particular operation. This means that **if you do something slow in your event handler callback, it will likely finish running** _**after**_ **the operation is completed**. Depending on your expectations, this could cause chaos for inexperienced developers.

## Focus assignment

The [DOM Mutation](reference/operations/dom-mutations.md) operations accept an optional `focusSelector` parameter that allows you to specify a CSS selector to which element should be active \(receive focus\) after the operation completes.

If `focusSelector` is not specified, the focus will go to the element that was active immediately before the operation was executed.

It is possible to perform an operation that removes the previously active element, leaving the focus in an ambiguous state. It's also possible to use the [set\_focus](reference/operations/browser-manipulations.md#set_focus) operation to manually set the focus at any time.

## ActionCable Connection authentication

Since it's difficult to improve upon perfection, please consult the StimulusReflex documentation section on [authenticating users in ActionCable](https://docs.stimulusreflex.com/authentication).

## Send data to any ActionCable Channel

There are times where it might be useful to send data directly to any clients subscribed to a given Channel stream identifier. It's even compatible with a CableReady performer since the data you send will \(hopefully\) not have a `cableReady` key present.

```ruby
ActionCable.server.broadcast("your-stream-identifier", data)
```

You can see this technique used in "[Verify ActionCable](troubleshooting/#verify-actioncable)".

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
    console.log('Data was received!')
  }
})
```

## Disconnect a user from their ActionCable Connection

As you can see in the upcoming section on [connection identifiers](identifiers.md#stream-identifiers-from-accessors), ActionCable Connections can designate that they are able to be `identified_by` one or more objects. These can be strings or ActiveRecord model resources. It is **only** using one of these connection identifiers that you can forcibly disconnect a client connection entirely.

Forcing a websocket reconnection is mainly useful for upgrading account privileges after successfully authenticating. You could also disconnect former employees after they've been terminated.

This is going to look a lot like an ActiveRecord finder, but it's a trap! _This is no such thing._ The only thing it can look up are connection identifiers that have already been defined on the Connection class. You need a valid resource reference \(i.e. a user that is actually connected\) to get a match on the ActionCable `remote_connections` mapping. Otherwise, the following will simply fail silently:

```ruby
ActionCable.server.remote_connections.where(current_user: User.find(1)).disconnect
```

The ActionCable Channel subscriber will immediately start attempting to reconnect to the server, with the usual connection retry rate fall-off curve, just as if you restarted your Puma process.

### Disconnecting when you have multiple identifiers

It's not clear whether this is a bug or a feature, but ActionCable will not allow you to disconnect a user if your Connection has any identifiers which haven't been assigned. Specifically, if you have configured your Connection to be `identified_by` both `current_user` and `session_id`, it will raise an error if your user hasn't authenticated yet. That's no good!

Our suggestion is that you **fix ActionCable** with this initializer, which changes line 6 from `all?` to `any?`

{% code title="config/initializers/action\_cable.rb" %}
```ruby
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
{% endcode %}

## Integrating with StimulusReflex

StimulusReflex is the sister library to CableReady. It's... really great, actually.

| Library | Responsibility |
| :--- | :--- |
| StimulusReflex | Translates user actions into server-side events that change your data, then regenerating your page based on this new data **into an HTML string**. |
| CableReady | Takes the HTML string from StimulusReflex and sends it to the browser before using morphdom to update only the parts of your DOM that changed. |

⬆️ StimulusReflex is for **sending** commands. 📡  
⬇️ CableReady is for **receiving** updates. 👽

{% hint style="info" %}
A Reflex action is a reaction to a user action that changes server-side state and re-renders the current page \(or a subset of the current page\) for that particular user in the background, provided that they are still on the same page.

A CableReady operation is a reaction to some server-side code \(which must be imperatively called\) that makes some change for some set of users in the background.
{% endhint %}

{% embed url="https://www.youtube.com/watch?v=dPzv2qsj5L8" %}

If you would like to read more about using StimulusReflex with CableReady, please consult "[Using CableReady inside a Reflex action](https://docs.stimulusreflex.com/reflexes#using-cableready-inside-a-reflex-action)".

