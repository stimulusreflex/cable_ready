# Cookies

## [pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)

{% hint style="info" %}
Adds a state to the browser's session history stack.
{% endhint %}

```ruby
cable_ready["MyChannel"].push_state(
  url:   "string", # required - The URL to assign
  state: {},       # [null] - An object representing the new state
  title: "string"  # [null] A title for the new state
)
```

