---
description: How to get setup with CableReady
---

# Setup

### Installation

```bash
bundle add cable_ready
yarn add cable_ready
```

### ActionCable Setup

```bash
bundle exec rails generate channel Example
```

{% tabs %}
{% tab title="Client" %}
{% code title="app/javascript/channels/example\_channel.js" %}
```bash
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
})
```
{% endcode %}
{% endtab %}

{% tab title="Server" %}
{% code title="app/channels/example\_channel.rb" %}
```ruby
class ExampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "example-stream"
  end
end
```
{% endcode %}
{% endtab %}
{% endtabs %}

### Application Setup

{% tabs %}
{% tab title="Controllers" %}
{% code title="app/controllers/examples\_controller.rb" %}
```ruby
class ExamplesController < ApplicationController
  include CableReady::Broadcaster

  def index
    # logic...
    cable_ready["example-stream"].inner_html(
      selector: "body",
      html: "Hello World this is the controller."
    )
    cable_ready.broadcast
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="ActiveJobs" %}
{% code title="app/jobs/example\_job.rb" %}
```ruby
class ExampleJob < ApplicationJob
  include CableReady::Broadcaster
  queue_as :default

  def perform(*args)
    # logic...
    cable_ready["example-stream"].inner_html(
      selector: "body",
      html: "Hello World this is the background job."
    )
    cable_ready.broadcast
  end
end
```
{% endcode %}
{% endtab %}
{% endtabs %}

**CableReady supports quite a few DOM operations that can be broadcast to connected clients.** [View the full list here](usage/dom-operations/).

### Misc

{% hint style="info" %}
By default, CableReady will emit a warning to the console log if it cannot find a DOM element matching the specified selector. If you would prefer to silently ignore operations on elements that don't exist, CableReady.perform accepts an options object as a second parameter: `CableReady.perform(data.operations, { emitMissingElementWarnings: false })`
{% endhint %}

