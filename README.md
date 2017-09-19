# CableReady

CableReady provides a standard interface for invoking common client-side DOM operations
from the server via Ruby on Rails' [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

## Supported DOM Operations

### [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

Dispatches a DOM event in the browser.

```ruby
cable_ready_broadcast "my_channel", dispatch_event: [{
  event_name: "string", # required - the name of the DOM event to dispatch (can be custom)
  element_id: "string", # [window] - the DOM element id of the desired event target
  detail:     "object"  # [null]   - assigned to event.detail
}]
```

### [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

Sets the innerHTML of a DOM element.

```ruby
cable_ready_broadcast "my_channel", inner_html: [{
  element_id: "string", # required - the DOM element id of the element to be mutated
  html:       "string"  # [null]   - the HTML to assign
}]
```

### [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

Inserts HTML into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready_broadcast "my_channel", insert_adjacent_html: [{
  element_id: "string", # required    - the DOM element id of the referenced element
  position:   "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  html:       "string"  # [null]      - the HTML to assign
}]
```

### [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

Removes an element from the DOM.

```ruby
cable_ready_broadcast "my_channel", remove: [{
  element_id: "string" # required - the DOM element id of the element to be removed
}]
```

### [replace](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)

Replaces a DOM element with new HTML.

```ruby
cable_ready_broadcast "my_channel", replace: [{
  element_id: "string", # required - the DOM element id of the element to be replaced
  html:       "string"  # [null]   - the HTML to use as replacement
}]
```

### [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Sets the text content of a DOM element.

```ruby
cable_ready_broadcast "my_channel", text_content: [{
  element_id: "string", # required - the DOM element id of the element to be mutated
  text:       "string"  # [null]   - the text to assign
}]
```

## Quick Start

```ruby
# app/models/user.rb
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_changed
    channel = "user/#{id}"
    cable_ready_broadcast channel, text_content: [{ element_id: "user-name", text: name }]
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
