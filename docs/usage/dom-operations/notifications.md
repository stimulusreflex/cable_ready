# Notifications

## [consoleLog](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)

{% hint style="info" %}
Output a message to the web console.
{% endhint %}

```ruby
cable_ready["MyChannel"].console_log(
  message: "string", # required, although it can be empty
  level: "string" # optionally specify one of "warn", "info" or "error"
)
```

## [notification](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

{% hint style="info" %}
Display a native system notification to the end user. This will happen outside the top-level browsing context viewport, so therefore can be displayed even when the user has switched tabs or moved to a different app. Native notifications are designed to be compatible with existing notification systems, across different platforms.

You can learn about [all of the possible options](https://developer.mozilla.org/en-US/docs/Web/API/Notification) on MDN.

The most obviously useful is `body` which is the message below the title. You might also want to specify `icon` which takes a URL to an image. You can even `vibrate` their phone or mark your message as `silent`.
{% endhint %}

{% hint style="warning" %}
The user will be asked to Allow or Block notifications. You cannot force them to accept.
{% endhint %}

```ruby
cable_ready["MyChannel"].notification(
  title: "string", # required, although it can be empty
  options: {} # see options such as body, icon, vibrate, silent
)
```

#### Example:

```ruby
cable_ready["MyChannel"].notification(
  title: "You are the best.",
  options: {
    body: "How does it feel to be your parents' favourite?",
    icon: "https://source.unsplash.com/256x256",
    vibrate: [200, 200, 200],
    silent: false
  }
)
```



