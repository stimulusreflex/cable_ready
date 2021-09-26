# Ride the Cable Car

When we made custom operations possible in CableReady, we saw an explosion of creative and powerful extensions. What we didn't expect was how people started to use operations in clever ways that we hadn't anticipated; the drugs kicked in hard the first time we saw someone calling `CableReady.perform()` _inside an operation_.

![](.gitbook/assets/bats.jpg)

CableReady-the-Library - which was created for ActionCable - had become just one of several possible delivery mechanisms for CableReady-the-Format. \(Convention? Protocol? Standard? Data structure?\)

**We have exposed the operation queueing API as Cable Car, making CableReady over Ajax a reality.**

## Introducing `cable_car`

The `CableReady::Broadcaster` Concern now provides a `cable_car` method \(in addition to the familiar `cable_ready` method\) which you can call anywhere in your application.

You use `cable_car` to chain together operations which will ultimately be converted into JSON that the CableReady client can process.

Unlike ActionCable `Channels` - which are delivered over WebSockets - Cable Car isn't opinionated about how you plan to use the JSON it creates. It doesn't have any broadcast capacity of its own, making it a perfect fit for controller actions responding to HTTP requests, ActiveJob scheduling and even persisting operations to your database.

Using `cable_car` is very similar to using the `cable_ready` method, except that there is no stream identifier \("no square brackets"\). Instead of sending data with `broadcast`, you generate JSON with `dispatch`:

```ruby
operations = cable_car.inner_html("#users", html: "<b>Users</b>").dispatch
```

`operations` is an Array that describes a batch of queued operations.

#### Wait, what's in that Array?!

The Array contains an Object for every operation currently enqueued. Each Object contains, at minimum, a key called `operation` which identifies the operation type. Depending on the operation, additional 

```javascript
{"innerHtml"=>[{"html"=>"<b>Users</b>", "selector"=>"#users"}]}
```

Each inner Hash has camelCased keys corresponding to the options passed to it when the operation was created. The server doesn't know what options any given operation is expecting, and any extra options will be passed to the client as extra information which can be accessed with an event handler \(or Reflex callback method\).

You can now convert the Hash to JSON using the `to_json` method and send it to the client via the mechanism of your choice:

```ruby
operations.to_json
"{\"innerHtml\":[{\"html\":\"\\u003cb\\u003eUsers\\u003c/b\\u003e\",\"selector\":\"#users\"}]}"
```

Pass the JSON into `CableReady.perform()` and the operations will be executed, regardless of how they got to the the browser.

You can call `cable_car` and add operations multiple times, and it will continue to accumulate operations until you do something to clear the queue. Like the `broadcast` method, `dispatch` accepts an optional boolean keyword argument `clear`, which you can use to return the current JSON blob without clearing the queue.

## Operations Renderer

One of the most exciting possibilities for Cable Car is to send operations in response to an Ajax request. We've made CableReady-over-Ajax even easier with the operations renderer:

```ruby
class HomeController < ApplicationController
  def index
    render operations: cable_car.console_log(message: "hi")
  end
end
```

How cool is that? Next, we'll look at how to put this technique to work.

## "Ajax Mode"

Accessing CableReady with `fetch` is a snap. We need a button to kick things off, and an empty DIV element named `users` to receive updates. The button calls `go` on a Stimulus controller:

```markup
<button data-controller="cable-car" data-action="cable-car#go">Cable Car</button>
<div id="users"></div>
```

{% code title="cable\_car\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  go () {
    fetch('/ride')
      .then(r => r.json())
      .then(CableReady.perform)
  }
}
```
{% endcode %}

No need to get fancy: we parse the String that comes back as JSON, and pass it straight into `CableReady.perform`.

On the server side, we need to make sure that the request is sent to the right controller:

{% code title="config/routes.rb" %}
```ruby
Rails.application.routes.draw do
  get "ride", to: "home#ride" 
end
```
{% endcode %}

Finally, we render the operations like a boss:

```ruby
class HomeController < ApplicationController
  include CableReady::Broadcaster

  def ride
    render operations: cable_car.inner_html("#users", html: "<span>winning</span>")
  end
end
```

That's it! Honestly, the only way it could be easier is if you just used StimulusReflex. 😛

## Operation Serialization

[Earlier](cable-car.md#wait-whats-in-that-hash), we saw how calling `dispatch` on a `cable_car` method chain produces a Hash that represents all of your queued operations. What if you are not quite ready to send those updates, or want to save them in your database?

