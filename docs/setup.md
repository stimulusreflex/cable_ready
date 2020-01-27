---
description: How to get setup with CableReady
---

# Setup

```bash
yarn add cable_ready
```

{% code-tabs %}
{% code-tabs-item title="Gemfile" %}

```ruby
gem "cable_ready"
```

{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="app/assets/javascripts/channels/user.js" %}

```javascript
import CableReady from 'cable_ready'

App.cable.subscriptions.create(
  { channel: 'UserChannel' },
  {
    received: function (data) {
      if (data.cableReady) {
        CableReady.perform(data.operations)
      }
    }
  }
)
```

{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
By default, CableReady will emit a warning to the console log if it cannot find a DOM element matching the specified selector. If you would prefer to silently ignore operations on elements that don't exist, CableReady.perform accepts an options object as a second parameter: `CableReady.perform(data.operations, { emitMissingElementWarnings: false })`
{% endhint %}
