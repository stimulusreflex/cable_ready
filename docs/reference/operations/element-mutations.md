# Element Property Mutations

## `add_css_class`

Adds a CSS class to an element. If the class already exists on the element, callback events will be emitted but no change will occur on the element itself.

Use `name` as an array to add multiple classes to the element.

```ruby
add_css_class(
  batch:      String,          # [null]   - add the operation to a named batch
  cancel:     Boolean,         # [false]  - cancel the operation (for use on client)
  delay:      Integer,         # [0]      - wait for n milliseconds before running
  name:       String or Array, # [null]   - CSS class name(s) to add
  select_all: Boolean,         # [false]  - operate on list of elements returned from selector
  selector:   String,          # required - string containing a CSS selector or XPath expression
  xpath:      Boolean          # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-add-css-class`
* `cable-ready:after-add-css-class`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

## `remove_attribute`

Removes an attribute from an element.

```ruby
remove_attribute(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String,  # required - the attribute to remove
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-attribute`
* `cable-ready:after-remove-attribute`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

## `remove_css_class`

Removes a CSS class from an element.

Use `name` as an array to remove multiple classes from the element.

```ruby
remove_css_class(
  batch:      String,          # [null]   - add the operation to a named batch
  cancel:     Boolean,         # [false]  - cancel the operation (for use on client)
  delay:      Integer,         # [0]      - wait for n milliseconds before running
  name:       String or Array, # [null]   - CSS class name(s) to remove
  select_all: Boolean,         # [false]  - operate on list of elements returned from selector
  selector:   String,          # required - string containing a CSS selector or XPath expression
  xpath:      Boolean          # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-css-class`
* `cable-ready:after-remove-css-class`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

## `set_attribute`

Sets an attribute on an element.

```ruby
set_attribute(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String,  # required - the attribute to set
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  value:      String,  # [null]   - the value to assign to the attribute
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

Setting an attribute changes the element's HTML, and you will see it reflected in your browser's element inspector. Conversely, properties reflect the live state of the DOM element created by interpreting the HTML.

While there is frequently a 1:1 mapping between attributes and properties, there is [a long list of gotchas](https://javascript.info/dom-attributes-and-properties). For example, changing the `value` attribute of a text input element does not change the current `value` property, or vice versa. Many debugging sessions conclude with frustration over the many attribute vs property gotchas.

::: warning
To set the value of a Boolean attribute, such as `disabled`, you can specify any value. An empty string or the name of the attribute are recommended values. All that matters is that if the attribute is present at all, _regardless of its actual value_, its value is considered to be `true`. The absence of the attribute means its value is `false`. By setting the value of the `disabled` attribute to the empty string (`""`), we are setting `disabled` to `true`, which results in the button being disabled.
:::

#### Life-cycle Callback Events

* `cable-ready:before-set-attribute`
* `cable-ready:after-set-attribute`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

## `set_dataset_property`

Sets an dataset property (`data-*` attribute) on an element.

```ruby
set_dataset_property(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String,  # required - the property to set, camelCased
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  value:      String,  # [null]   - the value to assign to the dataset
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

The `name` parameter must be passed as camelCase and without the `data-` prefix. If you have an `index` value defined on a Stimulus controller called `slide-show`, you will need to set:

```javascript
name: "slideShowIndexValue"
```

This method pairs extremely well with the new [Values](https://stimulus.hotwired.dev/reference/values) API in Stimulus 2, which allows you to specify certain dataset properties to monitor for changes. In addition to providing an excellent way to pass initialization settings to a controller, Stimulus will also execute a special callback if the dataset value is changed:

```javascript
export default class extends Controller {
  static values = { index: Number }

  indexValueChanged() {
    this.showSlide(this.indexValue)
  }

  // ...
}
```

This technique can be seen in action in the [stimulus-hotkeys](https://www.npmjs.com/package/stimulus-hotkeys) package. CableReady can be used to dynamically upset the user's keyboard shortcuts based on personal preferences in real-time, which is pretty damn cool.

#### Life-cycle Callback Events

* `cable-ready:before-set-dataset-property`
* `cable-ready:after-set-dataset-property`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

## `set_property`

Sets a valid property on an element to a new value.

```ruby
set_property(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String,  # required - string containing a valid property
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  value:      String,  # [null]   - the value to assign to the property
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

As discussed in the `set_attribute` description above, properties are the run-time characteristics of HTML that has been parsed and converted to a DOM element.

There are many concepts from the HTML markup that don't map cleanly to the JS representation - such as `class` vs. `className` for CSS classes - since `class` is a reserved word in Javascript.

While DOM elements have many standard properties, you can assign additional properties arbitrarily so long as you don't conflict with an existing property. This technique is known as "hanging" variables on DOM elements, and can be a very powerful tool. Remember: it's possible to hang variables off `document` and `window` if need be.

#### Life-cycle Callback Events

* `cable-ready:before-set-property`
* `cable-ready:after-set-property`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)

## `set_style`

Sets a single style on an element.

```ruby
set_style(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String,  # required - the style to set
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  value:      String,  # [null]   - the value to assign to the style
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-style`
* `cable-ready:after-set-style`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

## `set_styles`

Sets multiple styles on an element.

```ruby
set_styles(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   String,  # required - string containing a CSS selector or XPath expression
  styles: {
    background: "red",
    color: "white"
  },
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-styles`
* `cable-ready:after-set-styles`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

## `set_value`

Sets the value of an element.

```ruby
set_value(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  delay:      Integer, # [0]      - wait for n milliseconds before running
  select_all: Boolean, # [false]  - operate on list of elements returned from selector
  selector:   Boolean, # required - string containing a CSS selector or XPath expression
  value:      String,  # [null]   - the value to assign to the attribute
  xpath:      Boolean  # [false]  - process the selector as an XPath expression
)
```

::: warning
Remember, setting the `value` property of a DOM element will not add or modify any `value` attribute on the element.
:::

#### Life-cycle Callback Events

* `cable-ready:before-set-value`
* `cable-ready:after-set-value`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
