# Working with CableReady

CableReady is a simple library with a lot of power.

You can figure out [the basics](/hello-world/hello-world) in a few moments, but there is a wealth of optional features and enough syntactic sugar to give a large ant colony insulin shock, too.

## Passing extra options to operations

In addition to the standard, documented options for each operation, you can pass additional application-specific data to the client. These JSON-compatible options will be ignored by CableReady but available via [life-cycle events](/guide/working-with-cableready#listening-for-events) in the `detail` object.

You can use these ad hoc options to send extra information such as [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)s and even rendered bits of HTML to the client.

```ruby
cable_ready["biden"].set_cookie(
  cookie: "favorite_food=pasta",
  dog: "Major",
  corn_pop: "bad dude"
).broadcast
```

## Selectors

The `selector` option provided to DOM-mutating operations expects a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) that resolves to **one** single DOM element. The default element for all operations is `document` unless it is changed.

If multiple elements are returned, only the first one is used - unless the `select_all` option is used.

### `selector` as optional first argument

Since most CableReady operations require a `selector`, we made it the optional default first parameter to an operation - saving you some precious keystrokes. Just remember: it has to be first:

```ruby
inner_html("#carebears", html: "<b>Don't stare.</b>")
```

Note that if you try to specify `selector` both ways in one operation, the one in the Hash will take priority:

```ruby
inner_html("#red", selector: "#green", html: "<blink>Green wins!</blink>")
```

### `selector` will accept AR models and relations

You can pass selector (parameter and key/value, both) anything you can pass to [`dom_id`](/reference/methods#dom_id-record-prefix-nil), including models (like `User.first`, which beomes `#user_1`) and relations (`User.all` becomes `#users`).

```ruby
inner_html(User.first, html: "<span>Your mother</span>")
```

### `selector` remembers the previous selector

You know what sucks? Repeating yourself.

Each CableReady channel remembers the `selector` from the previous operation, if any. This means that you can specify a selector at the beginning of a chain, and it will automatically be picked up by succeeding operations until a new selector is used, at which point _that_ selector becomes the default selector for all following operations.

 If a new selector is used, all previously used selectors are unmodifed.

```ruby
set_focus("#smelly")
  .inner_html(html: "<span>I rock</span>")
  .set_style(name: "color", value: "red")
  .text_content(selector: User.all, text: "Bloom")
```

### Operating on multiple elements

Many [DOM Mutation](/reference/operations/dom-mutations) and [Element Property Mutation](/reference/operations/element-mutations) operations support a `select_all` option which instructs CableReady to operate on [one or many DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) returned by the `selector` query.

This technique is quite powerful because it can scoop up elements from multiple locations in the DOM based on their element type, id property, CSS class list or attributes. For example, you could grab every element with an instance of a Stimulus controller called `sushi`:

```ruby
text_content(select_all: true, selector: "[data-controller='sushi']")
```

::: warning
Each element will emit their own "before" and "after" events as part of the same operation.

Any information you change in these events could modify the behavior of the operation for the other elements that were selected. 🐉🐉🐉
:::

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
text_content(
  selector: "/html/body/div[3]/div[1]/article[1]/section[5]/ul[1]/li[10]/div[1]/div[2]",
  xpath: true,
  text: "XPath is under-utilized, but beware of side-effects changing your DOM."
)
```

It's very likely that you'll never need to use XPath in your applications and possibly even in your career. However, it's one of those things that when you need to build a list of children of the siblings of the current element's parent, you'll be really thankful that we included it.

::: tip
You can grab the XPath selector for any element using your browser's Element Inspector. Activate the desired element, right-click and select "Copy", then "Copy full XPath".
:::

Helpful references for working with XPath include [the only time W3Schools will be linked to from this site](https://www.w3schools.com/xml/xpath_syntax.asp), the [XPath cheatsheet](https://devhints.io/xpath), this [ultimate cheatsheet](https://www.softwaretestinghelp.com/xpath-writing-cheat-sheet-tutorial-examples/), and finally, an [exhaustive cheatsheet](https://www.lambdatest.com/blog/most-exhaustive-xpath-locators-cheat-sheet/).

Takeaway: XPath is extremely popular with cheaters.

::: warning
XPath selectors cannot be used with the `select_all` option, although if this is important to your application, let us know and we'll consider a more flexible implementation.
:::

## Operation Execution Order

CableReady executes operations in the order that they are created:

```ruby
console_log(message: "3").console_log(message: "1")
console_log(message: "2")
```

You will see the following in your Console Inspector:

```
3
1
2
```

## Operation Batches

CableReady operations can be grouped together using the `batch` option, which accepts either `true` or a string. **The goal of a batch is to know when all operations in a batch have been executed, even if other operations in a broadcast are still being executed.**

When all operations in a batch have been executed, CableReady will emit a `cable-ready:batch-complete` DOM event on the `document`. The `detail` object of the event will contain a key called `batch` which contains the name of the batch that was completed.

Each operation can belong to a maximum of one batch. **Batches do not impact the order in which operations are executed.**

Batches are reset after each `broadcast` - there is no such thing as a multi-broadcast batch. One broadcast can include operations that are batched alongside un-batched operations.

## Life-cycle events

All CableReady operations emit a DOM [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) immediately before an operation is executed, and another immediately after.

Events are emitted from the target `selector` if present; otherwise, they will default to `document`. Consult the documentation for each operation to confirm which object to listen to.

The event names follow a predictable pattern, as seen with `cable-ready:before-inner-html` and `cable-ready:after-morph`.

These events bubble and can be cancelled.

If jQuery is detected on the current page, jQuery events will be [triggered](https://api.jquery.com/trigger/) immediately after the DOM events. These jQuery events have the same name and `detail` accessors as their DOM event siblings.

A small number of operations, such as [`dispatch_event`](/reference/operations/event-dispatch#dispatch_event) and [`console_log`](/reference/operations/notifications#console-log), do not emit events. It's up to you to make sure that any [custom operations](customization#custom-operations) you create raise events, if desired.

::: info
Don't confuse Life-cycle events emitted by operations with the [dynamically defined events](/guide/leveraging-stimulus#dispatched-event-listener-controllers) you can send using `dispatch_event` operations. The ways you can capture them are the same, but Life-cycle events are part of the CableReady library behaviour whereas dispatched events are ad hoc and not constrained to CableReady operations.
:::

### Listening for events

You can create a callback function to handle the life-cycle events CableReady emits, and then register that callback as an [event listener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) without any [special tools](/guide/leveraging-stimulus).

Create **named functions** (and avoid anonymous functions) for your callbacks because it's impossible to [remove](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) an event listener with an anonymous callback.

```javascript
const afterMorphHandler = event => console.log(event.detail)
document.addEventListener('cable-ready:after-morph', afterMorphHandler)
```

Once you have captured an event, you can access all parameters provided to an operation via the `detail` object. Remember, all snake_case keys will be automatically converted to camelCase:

```javascript
const setCookieHandler = event => console.log(event.detail.cornPop)
document.addEventListener('cable-ready:after-set-cookie', setCookieHandler)
```

::: tip
It's easier to track related concepts transactionally in one broadcast than it is to assemble data from multiple broadcasts back into a coherent state.
:::

### Staggering operations

Sometimes, it can be hard to get the timing of things \*just right\*. CableReady is here to help, in the form of the `delay` option that is available for every operation.

By default, CableReady runs operations in the order that they are received. However, if an integer `delay` is provided, the execution of that operation will be delayed by `n` milliseconds. It is as if that particular operation is wrapped in a `setTimeout`, which is exactly correct.

```ruby
console_log(message: "3")
  .console_log(message: "2", delay: 1000)
  .console_log(message: "1", delay: 2000)
  .console_log(message: "Blast off?")
```

Remember: the individual operations are not aware of each other, so the delay is not cumulative. Plus, if you put a non-delayed operations after a delayed operation, the non-delayed operation will still fire immediately. The results of the example above will be:

```
3
Blast off?
2
1
```

You'll see the `3` and `Blast off?` immediately, followed by the `2` after a second, and `1` after another second.

### Modifying operations before they run

Almost all operations emit `cable-ready:before-{operation}` and `cable-ready:after-{operation}` events. If you create an event handler to listen for "before" events, you can access and modify most of the parameters passed when queueing the operation on the server.

Continuing the `set_cookie` example, the event handler is able to intercept the operation mid-flight and change the parameters.

```javascript
setCookieHandler = event => {
  event.detail.cookie = 'favorite_food=yams'
}
```

::: warning
If your operation is [processing multiple elements](/guide/working-with-cableready#operating-on-multiple-elements), each element will emit its own "before" and "after" events. If you change any values in the `event.detail` object, this new value will be picked up by the other elements associated with the current operation that have not been processed, yet.

You could conceivable change a value during the "before" callback, then change it back to the original value during the "after" callback. [This is almost certainly something you don't want to need to be able to do.](https://rubyonrails.org/doctrine/#provide-sharp-knives)
:::

### Cancelling operations

Almost all operations accept a `cancel` parameter that is designed to be interacted with in a "before" event handler on the client. `cancel` must be `false` or `undefined` when the event handler returns for the operation to run.

```javascript
setCookieHandler = event => {
  event.detail.cancel = true
}
```

Cancelled operations still emit an "after" event, but their primary functionality will not occur.

For example, if you have a long-running Reflex operation, the user might click a cancel button and proceed with their business. When the Reflex finally completes, your event handler can cancel the operation and prevent whatever would have happened.

::: warning
The server will have no idea that the operation was cancelled on the client. If this would create an inconsistency, you should send a cancel notification to the server, perhaps with a Nothing Reflex.
:::

While most developers will never think about or interact with the `cancel` parameter, it's an important tool to have available when building sophisticated client user interfaces.

::: danger
As with modifying `detail` data, if your operation is [processing multiple elements](/guide/working-with-cableready#operating-on-multiple-elements), each element will emit its own "before" and "after" events. You _could_ cancel an operation for a given element and then un-cancel it for later elements.

You _could_ jump out of an airlock into space, too. Don't say we didn't warn you! 👨‍🚀
:::

## Single Source of Truth

CableReady was created with a deep and informed belief that web[applications that maintain state on the server are fundamentally easier to design, build and maintain](/guide/advocating-for-reactive-rails).

However, one of the stranger edge-cases that must be handled in a websockets-enabled world is the potential for a server update to overwrite the value of a text input _while the user is typing into it_. It's a jarring example because it's an end-result that was almost completely impossible to achieve in the Ajax era. Despite our wildest brainstorms, we have yet to identify even a single scenario where a user would consider having their effort undone to be positive.

As a result, CableReady's popular [morph](/reference/operations/dom-mutations#morph) operation comes pre-installed with a [shouldMorph callback](/guide/customization#shouldmorph-callbacks) called `verifyNotMutable` that actively prevents the server from overwriting input, textarea and select elements while they are active (have focus).

Since forms are rarely designed to be edited by multiple concurrent users 😱 it's unlikely that you'll have to spend time thinking about this issue. If you're one of the lucky ones, you can use CableReady and StimulusReflex to establish a field-level locking system, or at the very least, update CSS or nearby indicators to show that a particular input is locked, contested or potentially out of date.

## Focus assignment

The [DOM Mutation](/reference/operations/dom-mutations) operations accept an optional `focusSelector` parameter that allows you to specify a CSS selector to which element should be active (receive focus) after the operation completes.

If `focusSelector` is not specified, the focus will go to the element that was active immediately before the operation was executed.

It is possible to perform an operation that removes the previously active element, leaving the focus in an ambiguous state. It's also possible to use the [`set_focus`](/reference/operations/browser-manipulations#set_focus) operation to manually set the focus at any time.

## Channel generator

CableReady provides a Rails generator that you can use to create ActionCable `Channel` classes and the client-side code required to subscribe to it.

Just provide it with the name of the channel class that you want to create, or pass `--help` to see all options:

```bash
rails g cable_ready:channel Sailor
```

The generator is interactive and will take you on a Choose Your Own Adventure through the decision tree of possible outcomes.

The first consideration is whether you want your `Channel` to stream to a resource using `broadcast_to` or will you `broadcast` from a string identifier? The details of these concepts are explored fully in [Stream Identifiers](/guide/stream-identifiers) and [Broadcasting to Resources](/guide/broadcasting-to-resources). You can provide one of either `--stream-from` or `--stream-for` with a value, or it will prompt you if you don't specify.

#### Broadcasting to a resource

If you answer yes to the `broadcast_to` question, it will then ask you for the class name of the resource you want to stream, just in case it's different from the class name of the `Channel` that you're creating. Assuming that you went with the default "Sailor", you'll now have a `Sailor Channel`:

::: code-group
```ruby [app/channels/sailor_channel.rb]
class SailorChannel < ApplicationCable::Channel
  def subscribed
    stream_for Sailor.find(params[:id])
  end
end
```
:::

The generator will then ask if you're going to use Stimulus to subscribe to the `Channel`. Even though CableReady does not require that you use Stimulus, we definitely recommend it as the blessed path. In this case, if you answer no, the generator is finished and you're on your own when it comes to subscribing. You'll have a

If you answer yes, it will create [a Stimulus controller that will subscribe to your Channel](/guide/leveraging-stimulus#introducing-the-stimulus-cableready-controller). The idea is that in your `app/javascript/controllers/index.js`, you will import the ActionCable `consumer.js` and [attach it to your Stimulus application](/guide/leveraging-stimulus#1-this-application-consumer). This makes the connection available to all Stimulus controllers while ensuring that all subscriptions share the same ActionCable `Connection`.

All you need to do is create an instance of the Stimulus controller on the markup (using a partial or ViewComponent) that sets the `data-{controller}-id-value` attribute:

::: code-group
```html [app/views/sailors/_sailor.html.erb]
<div data-controller="sailor" data-sailor-id-value="<%= sailor.id %>"></div>
```
:::

Now, whenever that Sailor partial is in the DOM, it will automatically subscribe itself to updates for the resource behind it. On the Ruby side, you can now do this:

```ruby
cable_ready[SailorChannel]
  .inner_html(html: "Howdy!")
  .broadcast_to(Sailor.first)
```

#### Broadcasting to a string identifier

If you answer no to the `broadcast_to` question, it will proceed to ask you for the stream identifier string that you'll be streaming from. Assuming that you accept the default "sailor", you'll now have a `Sailor Channel`:

::: code-group
```ruby [app/channels/sailor_channel.rb]
class SailorChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sailor"
  end
end
```
:::

You are free to customize the string as required by your application. On the client, `Channel` subscription classes load when your app loads and will stay connected, waiting for updates. It's up to you to decide whether this is appropriate for your application, and is out of scope for this section. Again, you'll find all of the details in the [Stream Identifiers](/guide/stream-identifiers) chapter.

Without any further modification, all users will receive all broadcasts sent to this `Channel` on every page:

```ruby
cable_ready["sailor"].inner_html(html: "Howdy!").broadcast
```

## Integrating with StimulusReflex

StimulusReflex is the sister library to CableReady. It's... really great, actually.

| Library | Responsibility |
| :--- | :--- |
| StimulusReflex | Translates user actions into server-side events that change your data, then regenerating your page based on this new data **into an HTML string**. |
| CableReady | Takes the HTML string from StimulusReflex and sends it to the browser before using `morphdom` to update only the parts of your DOM that changed. |

⬆️ StimulusReflex is for sending commands to the server. 📡  
⬇️ CableReady is for sending commands to the browser. 👽

::: info
A Reflex action is a reaction to a user action that changes server-side state and re-renders the current page (or a subset of the current page) for that particular user in the background, provided that they are still on the same page.

A CableReady operation is a reaction to some server-side code (which must be imperatively called) that makes some change for some set of users in the background.
:::

[![](https://img.youtube.com/vi/dPzv2qsj5L8/maxresdefault.jpg)](https://www.youtube.com/watch?v=dPzv2qsj5L8)

If you would like to read more about using StimulusReflex with CableReady, please consult "[Using CableReady inside a Reflex action](https://docs.stimulusreflex.com/guide/cableready)".
