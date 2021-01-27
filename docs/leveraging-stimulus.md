# Leveraging Stimulus

## Installing Stimulus

It's no secret that Team CableReady is a big fan of the [Stimulus](https://stimulus.hotwire.dev/) JavaScript framework. It makes possible our frequent need to provide abstract functionality and attach it to a DOM element as a behavior. It is the most effective way to maximize CableReady's potential, by allowing developers to wire up connections between DOM mutations and event handling. Not only does \[almost\] every CableReady operation emit before and after events, the [dispatch\_event](reference/operations/event-dispatch.md#dispatch_event) operation becomes incredibly powerful when paired with a Stimulus controller that receives it and can then bridge that event with `this.element` on a 1:1 basis.

While Stimulus is not installed by default in a new Rails app, you can install it easily by running:

```bash
rails webpacker:install:stimulus
```

## ActionCable Channel subscription classes

When you `rails generate channel` for the first time, several important files are generated for you:

* app/javascript/channels/index.js - `import`ed in your application.js pack, this loads all channels
* app/javascript/channels/consumer.js - shared, memoized ActionCable connection

Every generated channel \(including the first\) also get a matched pair of client and server classes:

* app/channels/chewies\_channel.rb
* app/javascript/channels/chewies\_channel.js

Reduced to its foundation, this is all that is required to create a websocket connection in Rails. It's pretty incredible that you can do so much with so little:

{% code title="app/javascript/channels/chewies\_channel.js" %}
```javascript
import consumer from './consumer'

consumer.subscriptions.create('ChewiesChannel', {
  received (data) {}
})
```
{% endcode %}

One of the most significant aspects of subscribing to ActionCable Channels using this approach is that these subscriptions are established at the time of the first page load. They are all-or-nothing \(there's no mechanism to decide that a subscription can be unsubscribed or resubscribed based on where you are in the UI\) and importantly, **they will survive Turbo Drive navigation events**. This is because those subscriptions are created at the page level, and are not tied to the DOM directly.

There's nothing wrong with page-level ActionCable Channel classes; indeed, it makes excellent sense for many use cases and [libraries](https://optimism.leastbad.com) to leverage a mechanism that is assumed to be present on every page. It is very common to import CableReady into a page-level Channel class.

There are, however, many reasons to move ActionCable Channel subscriptions \(and CableReady performers\) out of the page context and into Stimulus controllers:

* fine-grained control over **if and when** Channel subscriptions \(and potentially, unsubscriptions\) occur
* the opportunity to programmatically manipulate Channel subscriptions - and the Connection itself
* flexibility when handling the elevation of an anonymous visitor to a user with privileges

This is all possible - and scalable - because all Channels share the same memoized Connection, which lives at the page level. \(More on this [in a moment](leveraging-stimulus.md#1-this-application-consumer)!\)

{% hint style="info" %}
It's normal to `import` CableReady into multiple ActionCable Channel classes and Stimulus controllers at the same time, since they are all sharing the same code and resources.
{% endhint %}

## Introducing the Stimulus CableReady controller

![Stefon Meyers](.gitbook/assets/stefon.jpg)

There's... a lot to unpack, here:

{% code title="app/javascript/controllers/chewies\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  connect () {
    this.channel = this.application.consumer.subscriptions.create('ChewiesChannel', {
      received (data) {
        if (data.cableReady) CableReady.perform(data.operations)
      }
    })
  }
  
  disconnect () {
    this.channel.unsubscribe()
  }
}
```
{% endcode %}

#### 1. this.application.consumer

We don't need to import the shared, memoized `consumer.js` into every ActionCable Channel subscriber. Instead, we import it into `index.js` just once and attach it to the Stimulus Application object:

{% code title="app/javascript/controllers/index.js" %}
```javascript
// append to the bottom of existing file contents
import consumer from '../channels/consumer'
application.consumer = consumer
```
{% endcode %}

This isn't _just_ a way to DRY out and cut 1 LOC from all of your Stimulus controllers. 🤡 It's actually a critical step for [importing packaged Stimulus controllers](https://stimulusconnect.com/) that rely on ActionCable. Since `consumer.js` comes from the host application and there is no guarantee that every developer will leave it in the `app/javascript/channels` folder, there's no single path for a packaged controller to reliably import it from. `this.application.consumer` keeps the trains running and propels the Stimulus ecosystem.

#### 2. A variable representing the Channel subscription available in local scope

Stimulus gives us the opportunity to decide when and if a Channel subscription will occur, and a well-designed structure to handle flow if something goes wrong. A subscription might work best when the DOM element connects to the page, or it could be when the user clicks a toggle state button to "Active".

It also means that you have a convenient handle to be able to [send data](https://guides.rubyonrails.org/action_cable_overview.html#rebroadcasting-a-message) to the server or even [call methods](https://guides.rubyonrails.org/action_cable_overview.html#example-1-user-appearances) on the server:

```javascript
this.channel.send({ brand: "Tums", ingredient: "1177 mg Calcium Carbonate" })
this.channel.perform("eat", { flavor: "Orange Rush })
```

```ruby
class ChewiesChannel < ApplicationCable::Channel
  def receive(data)
    puts data # {:brand=>"Tums", :ingredient=>"1177 mg Calcium Carbonate"}
  end
  
  def eat(data)
    puts "You eat another #{data["flavor"]} chewy."
  end
end
```

#### 3. Life-cycle methods powered by a MutationObserver

It also means that we have the opportunity to unsubscribe from a Channel when the DOM element is removed from the page \(or a Turbo Drive navigation event occurs\). [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) is highly performant and it matters not whether an element was present in the initiate HTML payload used to build the page, or if it's attached to a component that was dynamically added later... MutationObserver will dutifully fire `connect` events when the element is created, and `disconnect` when the element is removed or destroyed.

#### 4. A 1:1 relationship between a Channel subscription and a DOM element

Less a code trick than a design pattern, you will learn more about this on the [Broadcasting to Resources](broadcasting-to-resources.md#fewer-promises-more-consciousness-expanding-code-samples-plz) page. Hint: an element that is intimately connected to a Channel subscription is a Channel that can update itself on the client, no matter how many people are looking at it.

#### 5. The opportunity to have multiple concurrent instances, each with their own Channel subscription

What's stopping you from having multiple active subscriptions to the same Channel but with different `params`? Absolutely nothing. Why isn't this concept touted as a flagship feature of ActionCable? 🍑🍆 if I know, but it's an absolute _game-changer_ when combined with Stimulus. You'll see why in [Broadcasting to Resources](broadcasting-to-resources.md#3-prepare-subscriber).

## Dispatched event listener controllers

After the fever-dream raving about many-to-many Channel subscribers, you would be forgiven if you're shocked that we _still_ haven't explained our favorite CableReady + Stimulus pattern: dispatched event listeners.

{% hint style="info" %}
This is different from Stimulus controllers which happen to listen for [CableReady operation life-cycle events](usage.md#life-cycle-events), which are _differently_ cool.
{% endhint %}

CableReady has an understated but wickedly powerful operation called [dispatch\_event](reference/operations/event-dispatch.md#dispatch_event). It lets you broadcast an arbitrary instruction to an element in your DOM, complete with a metadata payload.

Part of what makes `dispatch_event` so exciting is that you can enjoy many of the same results and benefits as a full ActionCable Channel subscriber, just by handling targeted events in an intelligent way.

#### Example 1: Toast notifications

One common use case is to notify the client when long-running server  process has completed. For example, we can broadcast a notification when a Rails ActiveJob has finished processing:

{% code title="app/jobs/dirty\_job.rb" %}
```ruby
class DirtyJob < ApplicationJob
  queue_as :default

  def perform(id)
    sleep 3
    cable_ready["DirtyChannel"].dispatch_event(
      name: "deed",
      detail: {
        id: id,
        cost: "dirt cheap"
      }
    ).broadcast
  end
end
```
{% endcode %}

On the client, you can pick up that event with a Stimulus controller that listens for the event and uses a [toast notification library](https://github.com/caroso1222/notyf) to inform the user.

{% code title="app/javascript/controllers/dirty\_deeds\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import { Notyf } from 'notyf'

export default class extends Controller {
  initialize () {
    this.notyf = new Notyf()
  }

  connect () {
    document.addEventListener('deed', this.notify)
  }
  
  disconnect () {
    document.removeEventListener('deed', this.notify)
  }
  
  notify = event => {
    const { id, cost } = event.detail
    this.notyf.success(`Dirty deed ${id} done ${cost}`)
  }
}
```
{% endcode %}

{% hint style="success" %}
The decision to use Stimulus `data-action` attributes or formal event listeners largely comes down to a question of taste and style, with a healthy dose of context. The author tends to prefer `addEventListener` for private, project-specific controllers, while assuming that the users of packages Stimulus controllers will typically use the declarative syntax.

Ask yourself: "who is the customer for this controller?" If you are the customer, explicitly declared listeners help self-document the controller and keeps you focused on one file in the editor. If other people are the customer, then you hope most of them are better served by thinking of the controller as a black box.
{% endhint %}

{% hint style="warning" %}
You could make a strong argument for implementing the notification toaster example above as an [ActionCable Channel subscription class](leveraging-stimulus.md#actioncable-channel-subscription-classes) that doesn't have to be assigned to a DOM element. It's always a trade-off between flexibility and reusability. This is a simplified example; in practice, similar controllers are used to achieve context-specific functionality.

If you find yourself creating an ActionCable Channel subscriber controller that's intended to live on the body element, take a moment to consider whether it should "just" be an ActionCable Channel subscription class.
{% endhint %}

#### Example 2: The message bus 🚌

The nature of Stimulus makes it exceptionally good at acting as a go-between, passing off instructions at lightning-speed to 3rd-party libraries that have no idea they are being puppeted from afar. The possibilities for creative programming are really exciting. The author has created Stimulus controllers to drive the Youtube player, play sounds, create Google Maps street view tours synchronized with external hardware inputs and even stream 3D transform coordinates into a [ragdoll physics simulation in a ThreeJS scene](https://schteppe.github.io/ammo.js-demos/demos/RagdollDemo/three.html).

One of the author's favorite pairings is the [Timeline](https://greensock.com/docs/v3/GSAP/Timeline) component from the excellent Greensock Animation library. Described as a "high-speed property setter", Timeline provides an expressive API for chaining a series of events placed on - you guessed it - a timeline. Your position on this timeline can be scrubbed, seeked, reversed, looped, repeated, yo-yoed, labelled and tweened to your heart's content.

What most folks don't seem to immediately grasp about Timeline - which is targeted at animators, after all - is that there doesn't actually have to be any visual animation whatsoever. You can use it exclusively to fire JavaScript callback functions with extremely high-fidelity timing accuracy. Here's a sample of the controller that kicks in when you attempt to "Suggest a package" \(see the left column\) on [StimulusConnect](https://stimulusconnect.com/) **without logging in first**:

```javascript
import { Controller } from 'stimulus'
import { gsap } from 'gsap'

export default class extends Controller {
  connect () {
    document.body.addEventListener('login:spotlight', this.play)
  }

  disconnect () {
    document.body.removeEventListener('login:spotlight', this.play)
  }

  play = () => {
    const tl = gsap.timeline({})
    tl.to(document, { onStart: this.createOverlay, duration: 1 })
    tl.to(document, { onComplete: this.addSpotlight, duration: 0.6 })
    tl.to(document, { onComplete: this.hideSpotlight, duration: 0.3 })
    tl.to(document, { onComplete: this.showSpotlight, duration: 0.2 })
    tl.to(document, { onComplete: this.hideSpotlight, duration: 0.1 })
    tl.to(document, { onComplete: this.showSpotlight, duration: 0.2 })
    tl.to(document, { onComplete: this.hideSpotlight, duration: 0.2 })
    tl.to(document, { onComplete: this.showSpotlight, duration: 0.4 })
    tl.to(document, { onComplete: this.hideSpotlight, duration: 0.1 })
    tl.to(document, { onComplete: this.showSpotlight, duration: 0.3 })
    tl.to(document, { onComplete: this.removeOverlay, duration: 0.8 })
  }
}
```

#### Example 3: The logical splitter

One question that comes up often on Discord is how to properly handle broadcasts to a group in situations where one of the people in the group is the person who initiated the broadcast. Frequently, interfaces arrange this kind of data with "my stuff" presented on one side and "everyone else" on the other side. If you just `morph` everyone's document directly, it'll look like your contributions are lumped in with everyone else... until you refresh the page and everything is as it should be. Clearly, this is not acceptable.

Our proposed solution is that instead of modifying the DOM directly, send a `dispatch_event` that has the rendered HTML for **both** the current user and everyone else available in _different keys_ of the `detail` object, along with the `user_id` of the contributing user. This `user_id` can be compared against the current user's `id` which has already been stored in a `meta` tag in the document `head`. Upon receiving a new update, the Stimulus controller can append the correct HTML fragment to the correct DOM element and the project is saved.

{% hint style="warning" %}
This technique is not well-suited to scenarios where sensitive data is being transmitted. Since all data being sent is visible via Network Inspector, please assume that all everyone receiving a message can see its contents.
{% endhint %}

#### Example 4: The Stimulus value attribute setter

The recent release of Stimulus v2 finally brought the [Values](https://stimulus.hotwire.dev/reference/values) API. Values maps a data attribute on the DOM element which holds the controller instance to a typed internal value. Updating the data attribute on the DOM element automatically fires a `ValueChanged` callback, if one is available. 👍

Since CableReady has a [set\_dataset\_property](reference/operations/element-mutations.md#set_dataset_property) operation, it is possible to create a tight loop between data changing on the server and the internal state of the exposed controller value.

A real-world example of value-setting is the [stimulus-hotkeys](https://github.com/leastbad/stimulus-hotkeys) controller, which maps keystroke combinations to methods on arbitrary Stimulus controllers. It is configured by setting the "binding" value to a JSON object that maps all of the associated key-&gt;action combinations, for example: `{"p": "#foo->example#ping"}` wires up the "p" key to fire the `ping` method on the `example` controller that lives on an element with the `id` "foo". Are you with me so far? 😅

The developer can present users with an interface to define their own customized keyboard shortcuts for the application. As the user creates or changes key mappings in the web UI and commits to them, CableReady can broadcast `set_dataset_property` operations to the `hotkeys` controller DOM element. The user's keystroke bindings immediately reflect their selected preferences.

This might seem like overkill for a web application, if you're not building the next GMail. However, if you consider the applicability to [Electron](https://www.electronjs.org/) applications, this kind of thing can shave weeks off development.

## When not to use Stimulus

It's not an accident that Stimulus does not have a `render` method, or any concept of emitting HTML to present a component. Conversely, the hardest part of learning the Reactive Rails stack is resisting the temptation to do heroic DOM modifications on the client that need to be synchronized with the server. Even the most passionate SSR enthusiast has long been told that tracking everything and rendering bits of HTML on the server is a little dirty and almost guaranteed to be slow. It's hard not to internalize prejudice, even when it's utterly unfounded. It's a special moment when you realize that yes, you really can track the active accordion tab on the server.

Stimulus will be your best friend when it comes to powerful callbacks and making magic happen when new content is added to the DOM. Things start to go off the Rails 🤡 when you start thinking like a React developer with a table to sort.

Don't use Stimulus to pick up a click on a sortable header, sort and reflow the visible data, serialize the table into a JSON blob and lob it to the server as an object for persisting. Just don't do it, okay? _Stop._

Instead, just send a request to the server - Reflex, Ajax, WeChat... it doesn't truly matter - and let the server broadcast a `morph` operation with the HTML which updates the table with the sorted data you need.

Then, pause to reflect. How quickly did you just get that done? And without any JSON payloads in sight.

