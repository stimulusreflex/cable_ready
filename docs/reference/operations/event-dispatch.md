# DOM Events

## dispatch\_event

Create a custom DOM event in the browser for the purpose of implementing custom functionality.

`dispatch_event` immediately dispatches a DOM CustomEvent in the browser. These events bubble up through the DOM and are cancelable.

If jQuery is in use \(and available in the global `window` scope\) `dispatch_event` will also [trigger a jQuery event](https://api.jquery.com/trigger/) with the same name.

```ruby
cable_ready["MyChannel"].dispatch_event(
  name:       "string",   # required - the name of the DOM event to dispatch (can be custom)
  detail:     {},         # [null]   - assigned to event.detail
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # [document] - string containing a CSS selector or XPath expression
  xpath:      true|false  # [false] - process the selector as an XPath expression
)
```

While the event itself is frequently the payload, you can build very powerful functionality by passing a Hash of metadata to the `detail` parameter.

{% hint style="info" %}
The `detail` parameter will convert `user_id` to `userId` - snake\_case to camelCase - for JS consumption on the client.
{% endhint %}

Developers frequently use `dispatch_event` to notify the client when long-running server  processes are completed. You can see an example in [Leveraging Stimulus](../../leveraging-stimulus.md#event-listener-controllers).

{% hint style="warning" %}
There are no life-cycle events emitted for `dispatch_event`.
{% endhint %}

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
* [https://github.com/caroso1222/notyf](https://github.com/caroso1222/notyf)
* [Dispatched event listener controllers](../../leveraging-stimulus.md#event-listener-controllers)

