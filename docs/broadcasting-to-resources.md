---
description: "\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467\U0001F469‍\U0001F469‍\U0001F467"
---

# Broadcasting to Resources

## stream\_for and broadcast\_to

Up until now, we've been [broadcasting](reference/methods.md#broadcast-identifiers-clear-true) CableReady operations to Channels using string-based stream identifiers like "sailors". [30 Helens agree](https://www.youtube.com/watch?v=INi4r2z7yGg): "sailors" will get you to your chosen port of call.

ActionCable - and by extension, CableReady - also [support](https://guides.rubyonrails.org/action_cable_overview.html#streams) broadcasting to a Rails resource, like `Helen.find(30)` or `current_user`. It does this using the [Global ID](https://github.com/rails/globalid) functionality in Rails, which allows you to create a unique string that can identify an ActiveRecord model.

Instead of `stream_from`, we're going to use the `stream_for` method:

```ruby
class HelensChannel < ApplicationCable::Channel
  def subscribed
    stream_for Helen.find(params[:id])
  end
end
```

{% hint style="info" %}
There is also [`stream_or_reject_for`](https://api.rubyonrails.org/v6.1.0/classes/ActionCable/Channel/Streams.html#method-i-stream_or_reject_for), which is intended for scenarios where you're looking up a record based on `params`, as in the example above. If you're dealing with sensitive information, `stream_or_reject_for` is a solid practice.
{% endhint %}

On the client, we subscribe to the Channel in the exact same way as you would with `stream_from`:

```javascript
consumer.subscriptions.create(
  {
    channel: 'HelensChannel',
    id: 30
  },
  {
    received (data) { if (data.cableReady) CableReady.perform(data.operations) }
  }
)
```

Now, we're able to [broadcast\_to](reference/methods.md#broadcast_to-model-identifiers-clear-true) the Channel so that **anyone currently subscribed to that resource** will receive the operations:

```ruby
helen = Helen.find(30)
cable_ready[HelensChannel].dispatch_event.broadcast_to(helen)
```

As you can see, we have traded our string-based stream identifiers for constant-based identifiers; specifically, the Channel class constant. This is paired up with the `broadcast_to` method, which requires that you pass a resource to it.

{% hint style="success" %}
This allows us to **shift our mental model** away from "who are we broadcasting to?" to "what is each _individual_ user interested in?"
{% endhint %}

## Why is this awesome?

`stream_from` and `broadcast` make it easy to develop reactive interfaces with Rails.

`stream_for` and `broadcast_to` actually unlock new feature and UX design possibilities.

### A brief refresher on why SPAs are even a thing, and not just the punch-line to a cautionary tale

React was created to address the technical challenges involved in the syncronization of notifications, likes and comments on different parts of a user's page, _in real-time_.

When you scroll through your unique newsfeed, everything you see on your screen \(or within a few dozen pixels of being on your screen\) is a carefully orchestrated close-up magic trick. Our brains are fooled into perceiving that newsfeed as one long, living document.

What's _really_ happening is that each item on your feed has been pre-cached, with a minimum viable DOM structure and just enough meta-data to allow it to subscribe itself to a firehose of scoped updates pertaining to that item. If the item is scrolled off the page far enough or the tab is inactive for more than a minute or three, the subscription is discarded and the item purges itself from the DOM.

### We don't need React to do this anymore

With CableReady, it's possible to present your users with composable, reactive interface elements that subscribe to their own real-time event stream with a few dozen lines of simple code.

{% hint style="warning" %}
This is not hyperbole. Do you remember the first time you saw ActiveRecord working and thought, "I must be missing something, because this is impossible?"

This is the same level of black magic. ⚗️
{% endhint %}

Setting up this pattern \[which Facebook broke the web to implement\] with CableReady requires about the same effort as updating a ActiveRecord model attribute with an Ajax fetch call:

1. Generate a CRUD resource and matching ActionCable Channel, e.g. `stream_for Helen.find(params[:id])`
2. Add a Stimulus controller that is also an ActionCable subscription consumer and a CableReady performer to the outermost element of the item partial or ViewComponent
3. Set the consumer to subscribe to its own Channel with model id metadata from the rendered markup
4. Allow users to add/remove specific resource instances, perhaps via a `has_many` relationship or even an integer array attribute
5. Everyone who changes attributes of the item \(think Likes\) triggers a `broadcast_to` that [morph](reference/operations/dom-mutations.md#morph)s the markup of the resource for anyone who has that instance displayed on their screen

### Fewer promises, more consciousness-expanding code samples plz

### 1. Configure channel

{% code title="app/channels/helens\_channel.rb" %}
```ruby
class HelensChannel < ApplicationCable::Channel
  def subscribed
    stream_or_reject_for Helen.find(params[:id])
  end
end
```
{% endcode %}

### 2. Setup partial

{% code title="app/views/helens/\_helen.html.erb" %}
```markup
<div data-controller="helen"
     data-helen-id-value="<%= helen.id %>"
     id="<%= dom_id(helen) %>">I am Helen #<%= helen.id %>.
</div>
```
{% endcode %}

### 3. Prepare subscriber

{% code title="app/javascript/controllers/helen\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  static values = { id: Number }

  connect() {
    this.channel = this.application.consumer.subscriptions.create(
      {
        channel: 'HelensChannel',
        id: this.idValue
      },
      {
        received (data) { if (data.cableReady) CableReady.perform(data.operations) }
      }
    )
  }

  disconnect() {
    this.channel.unsubscribe()
  }
}
```
{% endcode %}

### 4. Create UI for users to select and render their favorite Helens: left as an exercise for the developer 👵

### 5. Give each Helen the power to automatically broadcast updates to every subscribed client instance

{% code title="app/models/helen.rb" %}
```ruby
class Helen < ApplicationRecord
  after_update do
    cable_ready[HelensChannel].morph(
      selector: dom_id(self),
      html: render(self)
    ).broadcast_to(self)
  end
end
```
{% endcode %}

### Victory lap: use StimulusReflex to celebrate Helen's birthday 🎂

{% code title="app/views/helens/\_helen.html.erb" %}
```markup
<div data-controller="helen"
     data-helen-id-value="<%= helen.id %>"
     data-reflex="click->Helen#birthday"
     id="<%= dom_id(helen) %>">Helen #<%= helen.id %> is <%= helen.age %>.
</div>
```
{% endcode %}

{% code title="app/reflexes/helen\_reflex.rb" %}
```ruby
class HelenReflex < ApplicationReflex
  def birthday
    Helen.find(element["data-helen-id-value"]).age.increment!
    morph :nothing
  end
end
```
{% endcode %}

{% hint style="info" %}
Step 3 assumes that `this.application.consumer` is coming from the [controller index](leveraging-stimulus.md#1-this-application-consumer).

Step 5 assumes that `render` is [delegated to](usage.md#delegating-render-to-applicationcontroller) `ApplicationController`.
{% endhint %}

With easily implemented, many-to-many reactive morph primatives available, developers can start structuring their interfaces differently while making bolder feature scope decisions.

For example, this pattern blurs the distinction between \(and justification for\) the traditional separation betwen "index" and "show" views. Instead of demanding page-based navigation into detail views, next-generation Rails interfaces can use an IntersectionObserver and a CSS framework with a responsive grid to just drill into the available data, complete with a slick, faceted search UI mixed in as a concern.

Since all websocket traffic is moved through one Connection and Channel subscription overhead is cheaper than unsorted recycling, it means that developers will be free to build interfaces where it's no more computationally expensive to use components that update themselves - immediately after server-side state changes - than it is to just render static HTML.

![Helens](.gitbook/assets/helens.jpg)

One of the few ways that the future is likely to be similar to the past is that when fundamentally new tools become available, smart young people quickly start building things that simply didn't and likely couldn't have existed before.

Ironically, Facebook could only make React do all of the real-time magic because they have some of the smartest developers on the planet working on the _back-end_ of their UI.

With CableReady, what Facebook spent tens of millions of dollars engineering not so long ago is available to every Rails developer, for free.

## broadcast\_to current\_user

Many of us use the `current_user` pattern so often that we can almost forget that it's a resource. You know what doesn't forget? CableReady.

Assuming that you have your Connection class set up to be identified by the current user...

{% code title="app/channels/application\_cable/connection.rb" %}
```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      reject_unauthorized_connection unless self.current_user = env["warden"].user
    end
  end
end
```
{% endcode %}

... you can run `rails g channel users` to create a UsersChannel.

Set up UsersChannel to `stream_for` `current_user`:

```ruby
class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end
```

The cool thing about this is that there's no client code changes necessary. Just let your standard client-side `app/javascript/channels/users_channel.js` connect, and ActionCable will pull in the `current_user` reference from your Connection class, no `params` required.

```ruby
cable_ready[UsersChannel].text_content().broadcast_to(current_user)
```

You can broadcast to the `current_user` from anywhere in your app.

{% hint style="success" %}
You can [clone and experiment with the "streamfor" sample application](https://github.com/leastbad/streamfor) that demonstrates using `broadcast_to` to send updates to `current_user`.
{% endhint %}

## broadcast\_to multiple resources

Like [broadcast](reference/methods.md#broadcast-identifiers-clear-true), [broadcast\_to](reference/methods.md#broadcast_to-model-identifiers-clear-true) supports streaming to multiple constant-based identifiers at once, as well as holding back the purging of the queues with `clear: false`. When called without any identifiers, it will broadcast all queues with constant-based stream names.

```ruby
cable_ready[SweetChannel].morph
cable_ready[SourChannel].inner_html
cable_ready.broadcast_to(current_user, SweetChannel, SourChannel, clear: false)
cable_ready.broadcast_to(current_user, SweetChannel, clear: false)
cable_ready.broadcast_to(current_user, SourChannel)
cable_ready.broadcast_to(current_user)
```

This sent operations to: SweetChannel, SourChannel, SweetChannel, SourChannel, SweetChannel. That last line would have _also_ broadcast SourChannel, but that queue was cleared on line 5.

Broadcasting to multiple resources is a more useful power tool than the equivalent broadcast to multiple people. Many times, a user takes an action that will update elements that represent several resources, located in different parts of the DOM.

For example, hitting "Publish" or flipping a resource from Public to Private with a toggle button could update counts, prompt notifications and change background colors.

`broadcast_to` allows the developer to queue up all required interface updates on their respective Channels before delivering them with a single, brutal command.

## Using Signed Global ID for lookups

It's a solid practice to obscure potentially sensitive model `id` metadata in your views. For some applications, [slugs](https://github.com/norman/friendly_id) are a good approach. Other times, [Signed Global ID](https://github.com/rails/globalid)s \(aka sgid\) are a powerful choice because you cannot reverse engineer the model or id from the resulting string. You can even generate sgids which are use-limited.

If you set up your `ApplicationRecord` as we suggested in [CableReady Everywhere](cableready-everywhere.md#activerecord), you can just use the `sgid` method on your model:

{% code title="app/views/helens/\_helen.html.erb" %}
```markup
<div data-controller="helen" 
     data-helen-sgid-value="<%= helen.sgid %>"
     id="<%= helen.sgid %>">
</div>
```
{% endcode %}

Modify your Stimulus controller to process a string-based `sgid` instead of an `id`:

{% code title="app/javascript/controllers/helen\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  static values = { sgid: String }

  connect() {
    this.subscription = this.application.consumer.subscriptions.create(
      {
        channel: 'HelensChannel',
        sgid: this.sgidValue
      },
      {
        received (data) { if (data.cableReady) CableReady.perform(data.operations) }
      }
    )
  }

  disconnect() {
    this.subscription.unsubscribe()
  }
}
```
{% endcode %}

Instead of using `find`, just hand the parameter off to `GlobalID::Locator`:

{% code title="app/channels/helens\_channel.rb" %}
```ruby
class HelensChannel < ApplicationCable::Channel
  def subscribed
    stream_for GlobalID::Locator.locate_signed params[:sgid]
  end
end
```
{% endcode %}

We will have to provide our own selector string, with a `#` prepended to the `sgid`:

{% code title="app/models/helen.rb" %}
```ruby
class Helen < ApplicationRecord
  after_update do
    cable_ready[HelensChannel].morph(
      selector: "##{self.sgid}",
      html: render(self)
    ).broadcast_to(self)
  end
end
```
{% endcode %}

{% hint style="warning" %}
If you are using Signed Global IDs to do lookups, use of the `dom_id` helper becomes impossible as it reveals the model and id. Use the `sgid` as your `id` and you won't compromise the security you get with Signed Global IDs.
{% endhint %}

## Broadcasting to new resources

### Combining stream\_for and stream\_from

Building on the "[Multiple Identifiers](identifiers.md#multiple-identifiers)" and "[Stream Identifiers with logic](identifiers.md#stream-identifiers-with-logic)" sections on the [Stream Identifiers](identifiers.md) page, it is possible to `stream_for` multiple resources in one Channel, making use of ternary logic operators and any other decision making structure that might be applicable to your application. After all, if you have instantiated a model instance, you've ready used a substantial amount of logic that is hidden away behind syntactic magic.

`broadcast_to` is designed to enable shared experiences around resources. A resource that doesn't exist yet is fundamentally difficult to collaborate on. Yet, when you create an empty Google Doc and share editing rights, the document already exists in every meaningful way. If we want a similar outcome, we have to find creative ways to operate on resources that aren't persisted and might not pass validations.

In many cases, the best solution would be to save the new resource before displaying it to the user\(s\). You can delete unused stub resources with a recurring cleanup job.

If pre-saving is not feasible for your application, perhaps you could generate a UUID on the client and use that to create a temporarily subscription. If a UUID `param` arrives, establish the subscription and then create the model instance you need. Send the id of that model back to the client:

{% code title="app/channels/helens\_channel.rb" %}
```ruby
class HelensChannel < ApplicationCable::Channel
  def subscribed
    if params[:id]
      stream_for(Helen.find(params[:id]))
    else
      stream_from(params[:uuid])
      helen = Helen.create # sure, why not
      ActionCable.server.broadcast(params[:uuid], helen.id)
    end
  end
end
```
{% endcode %}

Seeing that there is no initial `id` value, we create a temporary UUIDv4 for the new resource and send that to the server. When the server sends us an integer back, we can set the `idValue` before unsubscribing from the channel and forcing another controller `connect` method. After all, it really is _just a method:_

{% code title="app/javascript/controllers/helen\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

const uuidv4 = () => {
  const crypto = window.crypto || window.msCrypto
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export default class extends Controller {
  static values = { id: Number }

  initialize() {
    this.uuid = uuidv4()
  }

  connect() {
    this.channel = this.application.consumer.subscriptions.create(
      {
        channel: 'HelensChannel',
        id: this.hasIdValue ? this.idValue : null,
        uuid: this.uuid
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
          else {
            this.idValue = data
            this.channel.unsubscribe()
            this.connect()
          }
        }
      }
    )
  }

  disconnect() {
    this.channel.unsubscribe()
  }
}
```
{% endcode %}

This was a pretty wacky example but it's here to get you thinking about how to use the standard ActionCable primatives alongside the abstractions that Stimulus and CableReady make possible.

Anyhow, let's wrap up with a few important details to keep in mind when combining `stream_from` and `stream_for` together:

* `cable_ready["helen-fans"]` and `cable_ready[HelensChannel]` are separate operation queues
* `broadcast` can only work with string-based stream identifiers
* `broadcast_to` can only work with constant-based stream identifiers
* if you use them both at the same time, you might have a brain tumor; good luck 🧠
* if you come up with an alternative approach for unpersisted records, [tell us about it](https://discord.gg/stimulus-reflex)

