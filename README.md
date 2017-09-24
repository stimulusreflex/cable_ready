[![Lines of Code](http://img.shields.io/badge/lines_of_code-106-brightgreen.svg?style=flat)](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/)
[![Code Status](http://img.shields.io/codeclimate/github/hopsoft/cable_ready.svg?style=flat)](https://codeclimate.com/github/hopsoft/cable_ready)
[![Dependency Status](http://img.shields.io/gemnasium/hopsoft/cable_ready.svg?style=flat)](https://gemnasium.com/hopsoft/cable_ready)

# CableReady

## Server Rendered SPAs :joy:

CableReady provides a standard interface for invoking common client-side DOM operations
from the server via [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

For a deeper dive into CableReady check out the [TodoMVC CableReady project](https://github.com/hopsoft/todomvc-cableready).

## Quick Start

> Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html) to learn more about ActionCable before proceeding.

```ruby
# app/models/user.rb
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready_broadcast "UserChannel", text_content: [{ selector: "#user-name", text: name }]
  end
end
```

```javascript
// app/assets/javascripts/application.js
/*
 *= require cable_ready
 */
```

```javascript
// app/assets/javascripts/channels/user.js
App.cable.subscriptions.create({ channel: "UserChannel" }, {
  received: function (data) {
    if (data.cableReady) {
      CableReady.perform(data.operations);
    }
  }
});
```

## Supported DOM Operations

- [dispatchEvent](#dispatchevent)
- [innerHTML](#innerhtml)
- [insertAdjacentHTML](#insertAdjacentHTML)
- [insertAdjacentText](#insertadjacenttext)
- [remove](#remove)
- [replace](#replace)
- [setValue](#setvalue)
- [setAttribute](#setattribute)
- [removeAttribute](#removeattribute)
- [addCssClass](#addcssclass)
- [removeCssClass](#removecssclass)
- [setDatasetProperty](#setdatasetproperty)

> The `selector` options use [Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to find elements.

> It's possible to invoke multiple DOM operations with a single ActionCable broadcast.

### DOM Events

#### [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

Dispatches a DOM event in the browser.

```ruby
cable_ready_broadcast "MyChannel", dispatch_event: [{
  name:     "string", # required - the name of the DOM event to dispatch (can be custom)
  detail:   "object", # [null]   - assigned to event.detail
  selector: "string"  # [window] - string containing one or more CSS selectors separated by commas
}]
```

### Element Mutations

#### [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

Sets the innerHTML of a DOM element.

```ruby
cable_ready_broadcast "MyChannel", inner_html: [{
  selector:      "string", # required - string containing one or more CSS selectors separated by commas
  focusSelector: "string", # [null]   - string containing one or more CSS selectors separated by commas
  html:          "string"  # [null]   - the HTML to assign
}]
```

#### [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Sets the text content of a DOM element.

```ruby
cable_ready_broadcast "MyChannel", text_content: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  text:     "string"  # [null]   - the text to assign
}]
```

#### [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

Inserts HTML into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready_broadcast "MyChannel", insert_adjacent_html: [{
  selector:      "string", # required    - string containing one or more CSS selectors separated by commas
  focusSelector: "string", # [null]      - string containing one or more CSS selectors separated by commas
  position:      "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  html:          "string"  # [null]      - the HTML to insert
}]
```

#### [insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText)

Inserts text into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready_broadcast "MyChannel", insert_adjacent_text: [{
  selector: "string", # required    - string containing one or more CSS selectors separated by commas
  position: "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  text:     "string"  # [null]      - the text to insert
}]
```

#### [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

Removes an element from the DOM.

```ruby
cable_ready_broadcast "MyChannel", remove: [{
  selector:      "string", # required - string containing one or more CSS selectors separated by commas
  focusSelector: "string"  # [null]   - string containing one or more CSS selectors separated by commas
}]
```

#### [replace](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)

Replaces a DOM element with new HTML.

```ruby
cable_ready_broadcast "MyChannel", replace: [{
  selector:      "string", # required - string containing one or more CSS selectors separated by commas
  focusSelector: "string", # [null]   - string containing one or more CSS selectors separated by commas
  html:          "string"  # [null]   - the HTML to use as replacement
}]
```

#### [setValue](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

Sets the value of an element.

```ruby
cable_ready_broadcast "MyChannel", set_value: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  value:    "string"  # [null]   - the value to assign to the attribute
}]
```

### Attribute Mutations

#### [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

Sets an attribute on an element.

```ruby
cable_ready_broadcast "MyChannel", set_attribute: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string", # required - the attribute to set
  value:    "string"  # [null]   - the value to assign to the attribute
}]
```

#### [removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

Removes an attribute from an element.

```ruby
cable_ready_broadcast "MyChannel", remove_attribute: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # required - the attribute to remove
}]
```

### CSS Class Mutations

#### [addCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Adds a css class to an element.
This is a `noop` if the css class is already assigned.

```ruby
cable_ready_broadcast "MyChannel", add_css_class: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # [null]   - the CSS class to add
}]

```
#### [removeCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Removes a css class from an element.

```ruby
cable_ready_broadcast "MyChannel", add_css_class: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # [null]   - the CSS class to remove
}]
```

### Dataset Mutations

#### [setDatasetProperty](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

Sets an dataset property (data-* attribute) on an element.

```ruby
cable_ready_broadcast "MyChannel", set_dataset_property: [{
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string", # required - the property to set
  value:    "string"  # [null]   - the value to assign to the dataset
}]
```

## Advanced Usage

Consider using CableReady in concert with a gem like
[SelfRenderer](https://github.com/hopsoft/self_renderer) to create a powerful SPA style user experience with the simplicity of server side rendering.

---

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/QMSjMHrtPhvfmCnk5Hbikhhr/hopsoft/cable_ready'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/QMSjMHrtPhvfmCnk5Hbikhhr/hopsoft/cable_ready.svg' />
</a>
