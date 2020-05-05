# Element Mutations

## [morph](https://github.com/patrick-steele-idem/morphdom)

{% hint style="info" %}
[Fast lightweight DOM diffing/patching](https://github.com/patrick-steele-idem/morphdom) without a virtual DOM.
{% endhint %}

```ruby
cable_ready["MyChannel"].morph(
  selector:                 "string",   # required - string containing a CSS selector or XPath expression
  html:                     "string",   # [null]   - the HTML to assign
  children_only:            true|false, # [null]   - indicates if only child nodes should be morphed... skipping the parent element
  permanent_attribute_name: "string",   # [null]   - an attribute name that prevents elements from being updated i.e. "data-permanent"
  focus_selector:           "string",   # [null]   - string containing a CSS selector
)
```

### JavaScript Events

* `cable-ready:before-morph`
* `cable-ready:after-morph`

## [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

Sets the innerHTML of a DOM element.

```ruby
cable_ready["MyChannel"].inner_html(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]   - string containing a CSS selector
  html:           "string"  # [null]   - the HTML to assign
)
```

### JavaScript Events

* `cable-ready:before-inner-html`
* `cable-ready:after-inner-html`

## [outerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML)

Replaces a DOM element with new HTML.

```ruby
cable_ready["MyChannel"].outer_html(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]   - string containing a CSS selector
  html:           "string"  # [null]   - the HTML to use as replacement
)
```

### JavaScript Events

* `cable-ready:before-outer-html`
* `cable-ready:after-outer-html`

## [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

Sets the text content of a DOM element.

```ruby
cable_ready["MyChannel"].text_content(
  selector: "string", # required - string containing a CSS selector or XPath expression
  text:     "string"  # [null]   - the text to assign
)
```

### JavaScript Events

* `cable-ready:before-text-content`
* `cable-ready:after-text-content`

## [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

Inserts HTML into the DOM relative to an element. Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_html(
  selector:       "string", # required    - string containing a CSS selector or XPath expression
  focus_selector: "string", # [null]      - string containing a CSS selector
  position:       "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  html:           "string"  # [null]      - the HTML to insert
)
```

### JavaScript Events

* `cable-ready:before-insert-adjacent-html`
* `cable-ready:after-insert-adjacent-html`

## [insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText)

Inserts text into the DOM relative to an element. Supports behavior akin to prepend & append.

```ruby
cable_ready["MyChannel"].insert_adjacent_text(
  selector: "string", # required    - string containing a CSS selector or XPath expression
  position: "string", # [beforeend] - the relative position to the DOM element (beforebegin, afterbegin, beforeend, afterend)
  text:     "string"  # [null]      - the text to insert
)
```

### JavaScript Events

* `cable-ready:before-insert-adjacent-text`
* `cable-ready:after-insert-adjacent-text`

## [remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

Removes an element from the DOM.

```ruby
cable_ready["MyChannel"].remove(
  selector:       "string", # required - string containing a CSS selector or XPath expression
  focus_selector: "string"  # [null]   - string containing a CSS selector
)
```

### JavaScript Events

* `cable-ready:before-remove`
* `cable-ready:after-remove`

## [setValue](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

Sets the value of an element.

```ruby
cable_ready["MyChannel"].set_value(
  selector: "string", # required - string containing a CSS selector or XPath expression
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

### JavaScript Events

* `cable-ready:before-set-value`
* `cable-ready:after-set-value`

