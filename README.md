# CableReady

CableReady provides a standard interface for invoking common client side
JavaScript DOM operations from Ruby via ActionCable.

## Supported DOM Operations

- [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

  ```ruby
  cable_ready_broadcast payload: {
    dispatch_event: [{
      event_name: "string", # required - the name of the event to dispatch
      element_id: "string", # [window] - the DOM element id of the desired event target
      detail:     "object"  # [nil]    - assigned to event.detail
    }]
  }
  ```

- [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
- [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)
- [replaceChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)
- [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

## Quick Start

```ruby
# app/models/user.rb
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_changed
    channel = "user/#{id}" # NOTE: channel defaults to UNDERSCORED_MODEL_NAME/ID
    cable_ready_broadcast channel: channel, text: [{ element_id: "nav-user-name", content: name }]
  end
end
```

```javascript
let App = {};
App.cable = ActionCable.createConsumer();
App.cable.subscriptions.create({ channel: "UserChannel" },
  received: function (data) {
    if (data.cableReady) {
      CableReady.receive(data.cableReady);
    }
  }
);
```
