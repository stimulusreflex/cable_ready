# CableReady

CableReady provides a consistent interface for common ActionCable operations.

## Supported Operations

- prepend
- append
- remove
- replace
- html
- text
- dispatch

## Quick Start

```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster
  after_save :update_display_name

  def update_display_name
    return unless saved_change_to_name?
    cable_ready_broadcast channel: "user/#{id}", text: [{ element_id: "nav-user-name", content: name }]
  end
end
```

```javascript
let App = {};
App.cable = ActionCable.createConsumer();
App.cable.subscriptions.create({ channel: "UserChannel" },
  received: function (data) {
    CableReady.run(data);
  }
);
```
