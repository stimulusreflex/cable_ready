---
description: Bootstrap a minimum viable CableReady install without bikeshedding
---

# Setup

::: tip
If your goals can be achieved by broadcasting operations to the current user from inside of a Reflex action method, you're already [good to go](https://docs.stimulusreflex.com/reflexes#using-cableready-inside-a-reflex-action) and can skip to [CableReady 101](/guide/cableready-101.md).
:::

To demonstrate a basic setup, we're going to use the built-in Rails `channel` generator to create an ActionCable [Channel](https://guides.rubyonrails.org/action_cable_overview.html#terminology-channels) class called `ExampleChannel`. If this is the first time you've generated a Channel, a number of important files and folders will be created.

```bash
bundle exec rails generate channel example
```

In this configuration, every client that subscribes to `ExampleChannel` will receive any broadcasts sent to to a stream called `visitors`. We'll talk more about streams soon. For now, `visitors` is for operations that will be sent to everyone currently looking at your site.

::: code-group
```ruby [app/channels/example_channel.rb]
class ExampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "visitors"
  end
end
```
:::

The generator also creates a JavaScript channel subscriber. Import `CableReady` and modify the `received` method to check incoming data for CableReady broadcasts.

::: code-group
```javascript [app/javascript/channels/example_channel.js]
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
})
```
:::

That's it! Let's get this party started and learn how to broadcast operations.
