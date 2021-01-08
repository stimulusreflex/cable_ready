# Customization

CableReady is _zero-config_, meaning that there is no elaborate setup ritual. Still, there are several ways to tweak how things work, especially when it comes to integrations with other libraries. 

## Custom Operations

You can add your own operations to CableReady by creating an initializer:

{% code title="config/initializers/cable\_ready.rb" %}
```ruby
CableReady::Channels.configure do |config|
  config.add_operation :jazz_hands
end
```
{% endcode %}

Then you need to add your operation's implementation to the CableReady client, ideally before you import your Stimulus controllers and/or ActionCable channel subscribers. Note that while the Ruby `add_operation` method expects a snake-cased Symbol, JavaScript methods are camelCased.

{% code title="app/javascript/packs/application.js" %}
```javascript
import CableReady from 'cable_ready'

CableReady.DOMOperations['jazzHands'] = operation => {
  console.log('Jazz hands!', operation)
}
```
{% endcode %}

Now you can call your custom operation like any other. Any options passed to the operation when it is queued will be sent as part of the broadcast to the client.

```ruby
cable_ready["visitors"].jazz_hands(thumbs: 2).broadcast
```

You can find inspiration for your own operations by checking out how the "factory default" operations were [implemented](https://github.com/hopsoft/cable_ready/blob/eb1267b02d6e2a1967881012e09c0cafa8c4c197/javascript/cable_ready.js#L133). The `innerHtml` method is an excellent starting point.

## shouldMorph and didMorph

The [morphdom](https://github.com/patrick-steele-idem/morphdom/) library supports providing a callback function to decide whether a DOM element **should** be morphed; if this callback returns false for an element, neither that element nor any of that element's children will be morphed.

There is also a corresponding callback function that will run only if an element **did** get morphed. So this is not "before and after", but "should I and did I?" By adding our own callback functions, we can add support for interacting with other libraries which would otherwise be difficult or impossible.

{% hint style="info" %}
`shouldMorph` and `didMorph` callbacks **only** impact use of the `morph` operation.
{% endhint %}

### shouldMorph Callbacks

CableReady's `onBeforeElUpdated` callback, `shouldMorph`, sequentially executes an array of functions called `shouldMorphCallbacks`. It comes [factory installed](https://github.com/hopsoft/cable_ready/blob/master/javascript/callbacks.js) with two callbacks that you can probably leave alone: [`verifyNotMutable`](usage.md#single-source-of-truth) and `verifyNotPermanent`. If you're not using StimulusReflex, you could experiment with `slice` to remove `verifyNotPermanent` for a small performance boost. 🤷

These callbacks need to return true if the element should be morphed, or else return false to skip it. All callbacks **must** return a boolean value, even if the purpose of of the callback is to perform some kind of meta-transformation on the elements, as you'll see with the Alpine example in a moment.

Your shouldMorph callback function will receive three parameters: the `options` passed to the `morph` method, `fromEl`, which is the element before it is \(potentially\) morphed, and `toEl`, which is the element `fromEl` will \(potentially\) be morphed into.

The primary use case of a shouldMorph callback is to skip elements that meet a certain criteria - or don't. This could be handy if you need to protect part of the DOM:

{% code title="app/javascript/packs/application.js" %}
```javascript
import CableReady from 'cable_ready'

const skipBanner = (options, fromEl, toEl) => {
  if (fromEl.id === 'ad-banner') return false
  return true
}

CableReady.shouldMorphCallbacks.push(skipBanner)
```
{% endcode %}

A sneaky second use of shouldMorph callbacks is to assume the function will return true, but use it as an opportunity to prepare the incoming element by copying something from the outgoing element. This is important for AlpineJS users, who need to clone Alpine's internal state machine so that components are [properly initialized](https://github.com/alpinejs/alpine/issues/826):

{% code title="app/javascript/packs/application.js" %}
```javascript
import CableReady from 'cable_ready'

const enableAlpine(options, fromEl, toEl) {
  if (fromEl.__x) { window.Alpine.clone(fromEl.__x, toEl) }
  return true
}

CableReady.shouldMorphCallbacks.push(enableAlpine)
```
{% endcode %}

### didMorph Callbacks

CableReady's `onElUpdated` callback, `didMorph`, sequentially executes an array of functions called `didMorphCallbacks`. These callbacks will **only** fire for elements which were successfully morphed.

Your didMorph callback function will receive two parameters: the `options` passed to the `morph` method, and `el`, which is the element after it has been morphed.

In the following example, users of the [Shoelace](https://shoelace.style/) web component UI toolkit can add the `hydrated` CSS class to every morphed element with a tagname that starts with "SL-".

{% code title="app/javascript/packs/application.js" %}
```javascript
import CableReady from 'cable_ready'

const fixShoelace(detail, el) {
  if (el.tagName.startsWith('SL-')) el.classList.add('hydrated')
}

CableReady.didMorphCallbacks.push(fixShoelace)
```
{% endcode %}

## performAsync

Do you love CableReady's `perform` method, but wish that it returned a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)? You are in luck!

{% code title="app/javascript/channels/example\_channel.js" %}
```javascript
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady)
      CableReady.performAsync(data.operations)
        .then(payload => {
          console.log(payload)
        })
        .catch(err => {
          console.log(err)
        })
  }
})
```
{% endcode %}

## emitMissingElementWarnings

By default, CableReady will generate a warning in your Console Log if you attempt to execute an operation on a selector that does not exist. Sometimes, this isn't desirable and you just want to silently ignore missing elements. This can be achieved by passing an object with `emitMissingElementWarnings: false` as the second parameter to `perform`.

An example of this behavior at work is in the [Optimism](https://optimism.leastbad.com/) channel subscriber class, which can occasionally generate validation warnings for fields that don't exist in your View:

{% code title="app/javascript/channels/optimism\_channel.js" %}
```javascript
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('OptimismChannel', {
  received (data) {
    if (data.cableReady)
      CableReady.perform(data.operations, {
        emitMissingElementWarnings: false
      })
  }
})
```
{% endcode %}

