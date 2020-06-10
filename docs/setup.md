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
bundle exec rails generate channel example
```

{% code title="app/channels/example\_channel.rb" %}
```ruby
class ExampleChannel < ApplicationCable::Channel
  def subscribed
    stream_from "example-stream"
  end
end
```
{% endcode %}

{% code title="app/javascript/channels/example\_channel.js" %}
```javascript
import CableReady from 'cable_ready'
import consumer from './consumer'

consumer.subscriptions.create('ExampleChannel', {
  received (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }
})
```
{% endcode %}

### Application Setup

{% code title="app/views/home/index.html.erb" %}
```markup
<h1>What will happen?</h1>

<div id="content"></div>
```
{% endcode %}

You can call ActionCable from an ActiveJob, an ActiveRecord callback, a rake task, inside of a StimulusReflex action method. Here we'll launch an ActiveJob from our controller. Five seconds after the page loads, you will see an update.

{% code title="app/controllers/home\_controller.rb" %}
```ruby
class HomeController < ApplicationController
  include CableReady::Broadcaster

  def index
    ExampleJob.set(wait: 5.seconds).perform_later
  end
end
```
{% endcode %}

{% code title="app/jobs/example\_job.rb" %}
```ruby
class ExampleJob < ApplicationJob
  include CableReady::Broadcaster
  queue_as :default

  def perform(*args)
    cable_ready["example-stream"].inner_html(
      selector: "#content",
      html: "Hello World this is the background job."
    )
    cable_ready.broadcast
  end
end
```
{% endcode %}

**CableReady supports quite a few DOM operations that can be broadcast to connected clients.** [View the full list here](usage/dom-operations/).

### Misc

{% hint style="info" %}
By default, CableReady will emit a warning to the console log if it cannot find a DOM element matching the specified selector. If you would prefer to silently ignore operations on elements that don't exist, CableReady.perform accepts an options object as a second parameter: `CableReady.perform(data.operations, { emitMissingElementWarnings: false })`
{% endhint %}

