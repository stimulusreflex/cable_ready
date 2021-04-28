# Notifications

## console\_log

Output a message to the browser console.

```ruby
cable_ready["MyChannel"].console_log(
  message: "string", # required, although it can be empty
  level:   "string"  # optionally specify one of "warn", "info" or "error"
)
```

{% hint style="warning" %}
There are no life-cycle events raised by `console_log`.
{% endhint %}

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Console/log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)

## notification

Display a native system notification to the end user. This will happen outside the top-level browsing context viewport, so therefore can be displayed even when the user has switched tabs or moved to a different app. Native notifications are designed to be compatible with existing notification systems, across different platforms.

You can learn about [all of the possible options](https://developer.mozilla.org/en-US/docs/Web/API/Notification) on MDN.

The most obviously useful is body which is the message below the title. You might also want to specify `icon` which takes a URL to an image. You can even `vibrate` their phone or mark your message as `silent`.

{% hint style="danger" %}
The user will be asked to Allow or Block notifications. You cannot force them to accept.
{% endhint %}

```ruby
cable_ready["MyChannel"].notification(
  cancel:  true|false, # [false]  - cancel the operation (for use on client)
  title:   "string",   # required, although it can be empty
  options: {}          # see options such as body, icon, vibrate, silent
)
```

#### Life-cycle Callback Events

* `cable-ready:before-notification`
* `cable-ready:after-notification`

Life-cycle events for `notification` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Notifications\_API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

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

## play\_sound

Play an .mp3 or .ogg audio file in the browser.

The [sound](https://www.dropbox.com/s/jka3a37ibbqiaqv/stimulus_reflex_sound_logo.mp3?dl=1) starts playing when the minimum viable amount of the sound file has been downloaded. If another sound request comes in while the first one is still playing, the first one stops.

CableReady subtly captures the first user interaction on the page to ensure this operation works well on all browsers, **including Safari Mobile**. A silent mp3 is played as soon as the page context is established. It is base64 encoded so there is no network request. At 93 bytes, it is the minimum viable mp3!

```ruby
cable_ready["MyChannel"].play_sound(
  cancel: true|false, # [false]  - cancel the operation (for use on client)
  src:    ""          # required - URL for audio file
)
```

{% hint style="info" %}
CableReady creates an HTML Audio instance on `document.audio` when the page loads. This object is technically available for you to use in your application as you see fit. Check out MDN for the full [audio API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio).
{% endhint %}

#### Life-cycle Callback Events

* `cable-ready:before-play-sound`
* `cable-ready:after-play-sound`

Life-cycle events for `play_sound` are raised on `document`.

`cable-ready:after-play-sound` is emitted either after the sound has finished playing, or immediately if the operation is cancelled.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio)
* [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

