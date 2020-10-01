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

#### Click Handlers

For reasons unclear, the Notification API doesn't make it easy to attach a click handler to your notifications. It could just be that they cannot guarantee it will work across all devices. If you have determined that you need to define a click handler, the recommended solution is to use a [dispatch\_event](https://cableready.stimulusreflex.com/usage/dom-operations/event-dispatch) operation to send an event to the client. Your event handler can then build up a Notification instance molded to your specific tastes.

```ruby
document.addEventListener('my-app:notify', e => {
  let permission
  Notification.requestPermission().then(result => {
    permission = result
    const { title, options, clickUrl } = e.detail
    if (result === 'granted') {
      const notification = new Notification
      notification.onclick = () => window.open(clickUrl)
      notification(title || '', options)
    }
  })
})
```

