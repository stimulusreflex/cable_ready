# CableReady

CableReady provides a standard interface for invoking common client side
JavaScript DOM operations from Ruby via ActionCable.

## Supported DOM Operations

- [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

  ```ruby
  cable_ready_broadcast payload: {
    dispatch_event: [{
      event_name: "string", # required - the name of the DOM event to dispatch (can be custom)
      element_id: "string", # [window] - the DOM element id of the desired event target
      detail:     "object"  # [null]   - assigned to event.detail
    }]
  }
  ```

- [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

  ```ruby
  cable_ready_broadcast payload: {
    inner_html: [{
      element_id: "string", # required - the DOM element id of the element to be mutated
      html:       "string"  # [null]   - the HTML to assign
    }]
  }
  ```

- [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

  ```ruby
  cable_ready_broadcast payload: {
    insert_adjacent_html: [{
      element_id: "string", # required    - the DOM element id of the element to be mutated
      position:   "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
      html:       "string"  # [null]      - the HTML to assign
    }]
  }
  ```

- [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

  ```ruby
  cable_ready_broadcast payload: {
    remove: [{
      element_id: "string" # required - the DOM element id of the element to be removed
    }]
  }
  ```

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
