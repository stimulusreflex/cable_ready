---
description: How to use CableReady
---

# Usage

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

{% code-tabs %}
{% code-tabs-item title="app/models/user.rb" %}
```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content selector: "#user-name", text: name
    cable_ready.broadcast
  end
end
```
{% endcode-tabs-item %}
{% endcode-tabs %}

