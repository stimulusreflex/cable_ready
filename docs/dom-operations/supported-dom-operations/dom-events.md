# DOM Events

## [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

{% hint style="info" %}
Dispatches a DOM event in the browser.
{% endhint %}

```ruby
cable_ready["MyChannel"].dispatch_event(
  name:     "string", # required - the name of the DOM event to dispatch (can be custom)
  detail:   "object", # [null]   - assigned to event.detail
  selector: "string"  # [window] - string containing a CSS selector or XPath expression
)
```

