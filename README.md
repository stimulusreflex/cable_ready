[![Lines of Code](http://img.shields.io/badge/lines_of_code-241-brightgreen.svg?style=flat)](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/)
[![Maintainability](https://api.codeclimate.com/v1/badges/83ddf1fee4af7e51a681/maintainability)](https://codeclimate.com/github/hopsoft/cable_ready/maintainability)

# CableReady

## Out-of-Band Server Triggered DOM Operations

CableReady provides a simple interface for triggering client-side DOM operations
from the server via [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html)
to learn more about ActionCable before proceeding.

## Setup

### JavaScript

```
yarn install cable_ready
```

### Gemfile

```ruby
gem "cable_ready"
```

## Usage

### app/assets/javascripts/channels/user.js

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

### app/models/user.rb

```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content selector: "#user-name", text: name
    cable_ready.broadcast
  end
end
```

## Supported DOM Operations

- [dispatchEvent](#dispatchevent)
- [morph](#morph)
- [innerHTML](#innerhtml)
- [outerHTML](#outerhtml)
- [insertAdjacentHTML](#insertAdjacentHTML)
- [insertAdjacentText](#insertadjacenttext)
- [remove](#remove)
- [setValue](#setvalue)
- [setAttribute](#setattribute)
- [removeAttribute](#removeattribute)
- [addCssClass](#addcssclass)
- [removeCssClass](#removecssclass)
- [setDatasetProperty](#setdatasetproperty)

> The `selector` options use [document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to find an element by default. [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) expressions can also be used if the `xpath` option is set to `true`. As with CSS selectors, the XPath expression must resolve to a single element and not a collection.

> It's possible to invoke multiple DOM operations with a single ActionCable broadcast.

> All DOM mutations have corresponding `before/after` events triggered on `document`.
> These events expose `event.detail` set to the arguments from the server.

## Xpath Example

### app/models/user.rb

```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content selector: "/html/body/div[1]/form/input[1]", text: name, xpath: true
    cable_ready.broadcast
  end
end
```

### DOM Events

#### [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

Dispatches a DOM event in the browser.

```ruby
cable_ready["MyChannel"].dispatch_event(
  name:     "string", # required - the name of the DOM event to dispatch (can be custom)
  detail:   "object", # [null]   - assigned to event.detail
  selector: "string"  # [window] - string containing a CSS selector or XPath expression
)
```

### Element Mutations

#### [morph](https://github.com/patrick-steele-idem/morphdom)

[Fast lightweight DOM diffing/patching](https://github.com/patrick-steele-idem/morphdom) without a virtual DOM.

```ruby
cable_ready["MyChannel"].morph(
  selector:       "string",  # required - string containing a CSS selector or XPath expression
  html:           "string"   # [null]   - the HTML to assign
  children_only:  true|false # [null]   - indicates if only child nodes should be morphed... skipping the parent element
  focus_selector: "string",  # [null]   - string containing a CSS selector
)
```

##### JavaScript Events

- `cable-ready:before-morph`
- `cable-ready:after-morph`

##### Stimulus Gotchas

For some reason [Stimulus](https://github.com/stimulusjs/stimulus) controllers don't reconnect after DOM mutations triggered by [Morphdom](https://github.com/patrick-steele-idem/morphdom).
You can force your controllers to reconnect with the following code.

```javascript
import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.name = this.element.dataset.controller;
    document.addEventListener('cable-ready:after-morph', this.reconnect.bind(this));
    );
  }

  reconnect() {
    setTimeout(() => this.element.setAttribute('data-controller', this.name), 1);
    this.element.setAttribute('data-controller', '');
  }
}
```

#### [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

Sets the innerHTML of a DOM element.

```ruby
cable_ready["MyChannel"].inner_html(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]   - string containing a CSS selector
  html:           "string"  # [null]   - the HTML to assign
)
```

##### JavaScript Events

- `cable-ready:before-inner-html`
- `cable-ready:after-inner-html`

#### [outerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML)

Replaces a DOM element with new HTML.

```ruby
cable_ready["MyChannel"].outerHTML(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]   - string containing a CSS selector
  html:           "string"  # [null]   - the HTML to use as replacement
)
```

##### JavaScript Events

- `cable-ready:before-outer-html`
- `cable-ready:after-outer-html`

#### [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Sets the text content of a DOM element.

```ruby
cable_ready["MyChannel"].text_content(
  selector: "string", # required - string containing a CSS selector or XPath expression
  text:     "string"  # [null]   - the text to assign
)
```

##### JavaScript Events

- `cable-ready:before-text-content`
- `cable-ready:after-text-content`

#### [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

Inserts HTML into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_html(
  selector:       "string", # required    - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]      - string containing a CSS selector
  position:       "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  html:           "string"  # [null]      - the HTML to insert
)
```

##### JavaScript Events

- `cable-ready:before-insert-adjacent-html`
- `cable-ready:after-insert-adjacent-html`

#### [insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText)

Inserts text into the DOM relative to an element.
Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_text(
  selector: "string", # required    - string containing a CSS selector or XPath expression
  position: "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  text:     "string"  # [null]      - the text to insert
)
```

##### JavaScript Events

- `cable-ready:before-insert-adjacent-text`
- `cable-ready:after-insert-adjacent-text`

#### [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

Removes an element from the DOM.

```ruby
cable_ready["MyChannel"].remove(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string"  # [null]   - string containing a CSS selector
)
```

##### JavaScript Events

- `cable-ready:before-remove`
- `cable-ready:after-remove`

#### [setValue](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

Sets the value of an element.

```ruby
cable_ready["MyChannel"].set_value(
  selector: "string", # required - string containing a CSS selector or XPath expression
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

##### JavaScript Events

- `cable-ready:before-set-value`
- `cable-ready:after-set-value`

### Attribute Mutations

#### [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

Sets an attribute on an element.

```ruby
cable_ready["MyChannel"].set_attribute(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string", # required - the attribute to set
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

##### JavaScript Events

- `cable-ready:before-set-attribute`
- `cable-ready:after-set-attribute`

#### [removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

Removes an attribute from an element.

```ruby
cable_ready["MyChannel"].remove_attribute(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # required - the attribute to remove
)
```

##### JavaScript Events

- `cable-ready:before-remove-attribute`
- `cable-ready:after-remove-attribute`

### CSS Class Mutations

#### [addCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Adds a css class to an element.
This is a `noop` if the css class is already assigned.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to add
)

```

##### JavaScript Events

- `cable-ready:before-add-css-class`
- `cable-ready:after-add-css-class`

#### [removeCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Removes a css class from an element.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to remove
)
```

##### JavaScript Events

- `cable-ready:before-remove-css-class`
- `cable-ready:after-remove-css-class`

### Dataset Mutations

#### [setDatasetProperty](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

Sets an dataset property (data-* attribute) on an element.

```ruby
cable_ready["MyChannel"].set_dataset_property(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string", # required - the property to set
  value:    "string"  # [null]   - the value to assign to the dataset
)
```

##### JavaScript Events

- `cable-ready:before-set-dataset-property`
- `cable-ready:after-set-dataset-property`

## JavaScript Development

Please run `bin/standardize` on your codebase before submitting commits.

## Contributing

This project uses [Standard](https://github.com/testdouble/standard)
and [Prettier](https://github.com/prettier/prettier) to minimize bike shedding related to code formatting.
Please run `./bin/standardize` prior submitting pull requests.

### Releasing

1. Bump version number at `lib/cable_ready/version.rb`
1. Run `rake build`
1. Run `rake release`
1. Change directories `cd ./javascript`
1. Run `yarn publish` - NOTE: this will throw a fatal error because the tag already exists but the package will still publish

## License

CableReady is released under the [MIT License](LICENSE.txt).
