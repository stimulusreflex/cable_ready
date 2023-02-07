# Customization

CableReady is _zero-config_, meaning that there is no elaborate setup ritual. Still, there are several ways to tweak how things work, especially when it comes to integrations with other libraries.

## Custom Operations

You can add your own operations to CableReady by creating an initializer:

::: code-group
```ruby [config/initializers/cable_ready.rb]
CableReady.configure do |config|
  config.add_operation_name :jazz_hands
end
```
:::

::: warning
The syntax for this process did change recently. We apologize for any inconvenience.
:::

Then you need to add your operation's implementation to the CableReady client, ideally before you import your Stimulus controllers and/or ActionCable channel subscribers. Note that while the Ruby `add_operation_name` method expects a snake-cased Symbol, JavaScript methods are camelCased.

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'

CableReady.operations.jazzHands = operation => {
  console.log('Jazz hands!', operation)
}
```
:::

::: warning
Before CableReady v5.0.0, `operations` was `DOMOperations`.
:::

Now you can call your custom operation like any other. Any options passed to the operation when it is queued will be sent as part of the broadcast to the client.

```ruby
cable_ready["visitors"]
  .jazz_hands(thumbs: 2)
  .broadcast
```

You can find inspiration for your own operations by checking out how the "factory default" operations were [implemented](https://github.com/hopsoft/cable_ready/blob/eb1267b02d6e2a1967881012e09c0cafa8c4c197/javascript/cable_ready.js#L133). The `setCookie` and `innerHtml` methods are an excellent starting point.

### Multi-element custom operations

If you need for your custom operation to support multi-element selectors, you will need to import the `processElements` function.

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'
import { processElements } from 'cable_ready/javascript/utils'

CableReady.DOMOperations.jazzHands = operation => {
  processElements(operation, element => {
    console.log('Jazz hands!', element, operation)
  })
}
```
:::

You can now call your custom operation with `select_all: true` and you will see a console log message for every matching element.

```ruby
cable_ready["visitors"]
  .jazz_hands(selector: ".hand", select_all: true, thumbs: 2)
  .broadcast
```

### before, operate, after

Would you like your custom operations to raise `before` and `after` events? Would you like your custom operations to be `cancel`able and able to be `delay`ed? CableReady's `utils` class provides all of the helper functions you might need:

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'
import { processElements, before, operate, after } from 'cable_ready/javascript/utils'

CableReady.DOMOperations.jazzHands = (operation, callee) => {
  processElements(operation, element => {
    before(element, callee, operation)
    operate(operation, () => {
      const { name, danceMove } = operation
      console.log(`Jazz hands! ${name} did the ${danceMove}.`)
    })
    after(element, callee, operation)
  })
}
```
:::

This looks more complex than it is. In reality, we did the work so you don't have to.

First, for security reasons, JavaScript won't tell us the name of the currently running function... so we have receive the `callee` as the second argument to our custom operation.

Inside of the `processElements` closure, we use the `before` and `after` functions to handle emitting our standardized events. In between, we pass our custom logic to the `operate` function. Someday soon, developers will be able to add processing stages to the `operate` function, but _today_, it's responsible for making operations able to be cancelled on the client, as well as making it possible for operations to `delay` their own execution.

Finally, you can pull any options that developers might have set when enqueueing the operation using object destructuring. In the example above, we accessed the `name` and `action` from the `operation`:

```ruby
cable_ready["visitors"]
  .jazz_hands(name: "Helen", dance_move: "Moonwalk")
  .broadcast
```

## Importing custom operations from npm packages

In addition to defining custom operations in your `application.js`, you can now load them from npm packages. The first example of this is the [`play_sound`](/reference/operations/notifications.md#play_sound) operation, which was removed from CableReady core in v5.0.0; some people didn't love our implementation, and we wanted them to be able to write their own - or skip it entirely.

`play_sound` now lives in the [`cableready/audio_operations`](https://github.com/cableready/audio_operations) repo on GitHub, which you can both import and clone to use as the basis for your own custom operations packages.

A package could be a great solution for you if you're trying to keep your application pack skinny, if you're trying to group/organize a large number of operations, or if you're sharing operations across multiple projects. You might even publish and promote your best custom operations for other CableReady developers to use.

::: tip
Ray Kurzweil once said that the first person to make a million dollars selling CableReady operations has already been born. 🤯
:::

### Importing AudioOperations

First, import the package:

```bash
yarn add @cable_ready/audio_operations
```

Add `play_sound` as an operation to your CableReady initializer:

::: code-group
```ruby [config/initializers/cable_ready.rb]
CableReady.configure do |config|
  config.add_operation_name :play_sound
end
```
:::

Now, add the lines required to import the `AudioOperations` to your pack file, and you can continue to use `play_sound` exactly as you did before:

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'
import AudioOperations from '@cable_ready/audio_operations'

CableReady.addOperations(AudioOperations)
```
:::

## `shouldMorph` and `didMorph`

The [morphdom](https://github.com/patrick-steele-idem/morphdom/) library supports providing a callback function to decide whether a DOM element **should** be morphed; if this callback returns false for an element, neither that element nor any of that element's children will be morphed.

There is also a corresponding callback function that will run only if an element **did** get morphed. So this is not "before and after", but "should I and did I?" By adding our own callback functions, we can add support for interacting with other libraries which would otherwise be difficult or impossible.

::: info
`shouldMorph` and `didMorph` callbacks **only** impact use of the `morph` operation.
:::

### `shouldMorph` Callbacks

CableReady's `onBeforeElUpdated` callback, `shouldMorph`, sequentially executes an array of functions called `shouldMorphCallbacks`. It comes [factory installed](https://github.com/hopsoft/cable_ready/blob/master/javascript/callbacks.js) with two callbacks that you can probably leave alone: [`verifyNotMutable`](/guide/usage.md#single-source-of-truth) and `verifyNotPermanent`. If you're not using StimulusReflex, you could experiment with `slice` to remove `verifyNotPermanent` for a small performance boost. 🤷

These callbacks need to return true if the element should be morphed, or else return false to skip it. All callbacks **must** return a boolean value, even if the purpose of of the callback is to perform some kind of meta-transformation on the elements, as you'll see with the Alpine example in a moment.

Your shouldMorph callback function will receive three parameters: the `options` passed to the `morph` method, `fromEl`, which is the element before it is (potentially) morphed, and `toEl`, which is the element `fromEl` will (potentially) be morphed into.

The primary use case of a shouldMorph callback is to skip elements that meet a certain criteria - or don't. This could be handy if you need to protect part of the DOM:

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'

const skipBanner = (options, fromEl, toEl) => {
  if (fromEl.id === 'ad-banner') return false
  return true
}

CableReady.shouldMorphCallbacks.push(skipBanner)
```
:::

A sneaky second use of shouldMorph callbacks is to assume the function will return true, but use it as an opportunity to prepare the incoming element by copying something from the outgoing element. This is important for AlpineJS users, who need to clone Alpine's internal state machine so that components are [properly initialized](https://github.com/alpinejs/alpine/issues/826):

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'

const enableAlpine(options, fromEl, toEl) {
  if (fromEl.__x) { window.Alpine.clone(fromEl.__x, toEl) }
  return true
}

CableReady.shouldMorphCallbacks.push(enableAlpine)
```
:::

### `didMorph` Callbacks

CableReady's `onElUpdated` callback, `didMorph`, sequentially executes an array of functions called `didMorphCallbacks`. These callbacks will **only** fire for elements which were successfully morphed.

Your didMorph callback function will receive two parameters: the `options` passed to the `morph` method, and `el`, which is the element after it has been morphed.

In the following example, users of the [Shoelace](https://shoelace.style/) web component UI toolkit can add the `hydrated` CSS class to every morphed element with a tagname that starts with "SL-".

::: code-group
```javascript [app/javascript/packs/application.js]
import CableReady from 'cable_ready'

const fixShoelace(detail, el) {
  if (el.tagName.startsWith('SL-')) el.classList.add('hydrated')
}

CableReady.didMorphCallbacks.push(fixShoelace)
```
:::

## `performAsync`

Do you love CableReady's `perform` method, but wish that it returned a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)? You are in luck!

::: code-group
```javascript [app/javascript/channels/example_channel.js]
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
:::

## `emitMissingElementWarnings`

By default, CableReady will generate a warning in your Console Log if you attempt to execute an operation on a selector that does not exist. Sometimes, this isn't desirable and you just want to silently ignore missing elements. This can be achieved by passing an object with `emitMissingElementWarnings: false` as the second parameter to `perform`.

An example of this behavior at work is in the [Optimism](https://optimism.leastbad.com/) channel subscriber class, which can occasionally generate validation warnings for fields that don't exist in your View:

::: code-group
```javascript [app/javascript/channels/optimism_channel.js]
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
:::
