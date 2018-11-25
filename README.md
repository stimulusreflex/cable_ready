[![Lines of Code](http://img.shields.io/badge/lines_of_code-217-brightgreen.svg?style=flat)](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/)
[![Code Status](https://img.shields.io/codeclimate/maintainability/hopsoft/cable_ready.svg?style=flat)](https://codeclimate.com/github/hopsoft/cable_ready)

# CableReady

## Out-of-Band Server Triggered DOM Operations

CableReady provides a simple interface for triggering client-side DOM operations
from the server via [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

## Quick Start

> Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html) to learn more about ActionCable before proceeding.

```ruby
# Gemfile
gem "cable_ready"
```

```javascript
// app/assets/javascripts/cable.js
//= require action_cable
//= require cable_ready
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

```ruby
# app/models/user.rb
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content selector: "#user-name", text: name
    cable_ready.broadcast
  end
end
```

See [CableReady TodoMVC](https://github.com/hopsoft/cable_ready_todomvc)
for a more complete reference implementation.

## Supported DOM Operations

- [dispatchEvent](#dispatchevent)
- [morph](#morph)
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
cable_ready["MyChannel"].dispatch_event(
  name:     "string", # required - the name of the DOM event to dispatch (can be custom)
  detail:   "object", # [null]   - assigned to event.detail
  selector: "string"  # [window] - string containing one or more CSS selectors separated by commas
)
```

### Element Mutations

#### [morph](https://github.com/patrick-steele-idem/morphdom)

[Fast lightweight DOM diffing/patching](https://github.com/patrick-steele-idem/morphdom) without a virtual DOM.

```ruby
cable_ready["MyChannel"].morph(
  selector:       "string",  # required - string containing one or more CSS selectors separated by commas
  html:           "string"   # [null]   - the HTML to assign
  children_only:  true|false # [null]   - indicates if only child nodes should be morphed... skipping the parent element
  focus_selector: "string",  # [null]   - string containing one or more CSS selectors separated by commas
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-morph`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
  - `event.detail.content` _a DocumentFragment representing the new content_
- `cable-ready:after-morph`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
  - `event.detail.content` _a DocumentFragment representing the new content_

#### [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

Sets the innerHTML of a DOM element.

```ruby
cable_ready["MyChannel"].inner_html(
  selector:       "string", # required - string containing one or more CSS selectors separated by commas
  focus_selector: "string", # [null]   - string containing one or more CSS selectors separated by commas
  html:           "string"  # [null]   - the HTML to assign
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-inner-html`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-inner-html`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Sets the text content of a DOM element.

```ruby
cable_ready["MyChannel"].text_content(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  text:     "string"  # [null]   - the text to assign
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-text-content`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-text-content`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

Inserts HTML into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_html(
  selector:       "string", # required    - string containing one or more CSS selectors separated by commas
  focus_selector: "string", # [null]      - string containing one or more CSS selectors separated by commas
  position:       "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  html:           "string"  # [null]      - the HTML to insert
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-insert-adjacent-html`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-insert-adjacent-html`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText)

Inserts text into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_text(
  selector: "string", # required    - string containing one or more CSS selectors separated by commas
  position: "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  text:     "string"  # [null]      - the text to insert
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-insert-adjacent-text`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-insert-adjacent-text`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

Removes an element from the DOM.

```ruby
cable_ready["MyChannel"].remove(
  selector:       "string", # required - string containing one or more CSS selectors separated by commas
  focus_selector: "string"  # [null]   - string containing one or more CSS selectors separated by commas
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-remove`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-remove`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [replace](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)

Replaces a DOM element with new HTML.

```ruby
cable_ready["MyChannel"].replace(
  selector:       "string", # required - string containing one or more CSS selectors separated by commas
  focus_selector: "string", # [null]   - string containing one or more CSS selectors separated by commas
  html:           "string"  # [null]   - the HTML to use as replacement
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-replace`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-replace`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [setValue](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

Sets the value of an element.

```ruby
cable_ready["MyChannel"].set_value(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-set-value`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-set-value`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

### Attribute Mutations

#### [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

Sets an attribute on an element.

```ruby
cable_ready["MyChannel"].set_attribute(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string", # required - the attribute to set
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-set-attribute`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-set-attribute`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

Removes an attribute from an element.

```ruby
cable_ready["MyChannel"].remove_attribute(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # required - the attribute to remove
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-remove-attribute`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-remove-attribute`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

### CSS Class Mutations

#### [addCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Adds a css class to an element.
This is a `noop` if the css class is already assigned.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # [null]   - the CSS class to add
)

```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-add-css-class`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-add-css-class`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

#### [removeCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Removes a css class from an element.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string"  # [null]   - the CSS class to remove
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-remove-css-class`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-remove-css-class`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

### Dataset Mutations

#### [setDatasetProperty](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

Sets an dataset property (data-* attribute) on an element.

```ruby
cable_ready["MyChannel"].set_dataset_property(
  selector: "string", # required - string containing one or more CSS selectors separated by commas
  name:     "string", # required - the property to set
  value:    "string"  # [null]   - the value to assign to the dataset
)
```

##### JavaScript Events

The following events are dispatched on `document`.

- `cable-ready:before-set-dataset-property`
  - `event.detail.config` _the config passed to the CableReady handler from the server_
- `cable-ready:after-set-dataset-property`
  - `event.detail.config` _the config passed to the CableReady handler from the server_

## JavaScript Development

The JavaScript source is located in `app/assets/javascripts/cable_ready/src`
& transpiles to `app/assets/javascripts/cable_ready.js` via Webpack.

```sh
# build javascript
./bin/webpack
```
