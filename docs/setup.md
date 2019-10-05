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
import CableReady from 'cable_ready';

App.cable.subscriptions.create({ channel: "UserChannel" }, {
  received: function (data) {
    if (data.cableReady) {
      CableReady.perform(data.operations);
    }
  }
});
```
{% endcode-tabs-item %}
{% endcode-tabs %}

