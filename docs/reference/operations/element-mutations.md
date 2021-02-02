# Element Property Mutations

## add\_css\_class

Adds a CSS class to an element. If the class already exists on the element, callback events will be emitted but no change will occur on the element itself.

```ruby
cable_ready["MyChannel"].add_css_class(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # [null]   - string containing the CSS class name to add
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

Use an array to add multiple classes to an element.

```ruby
cable_ready["MyChannel"].add_css_class(
  cancel:     true|false,            # [false]  - cancel the operation (for use on client)
  name:       ["string", "string2"], # [null]   - array with the CSS class names to add
  select_all: true|false,            # [false]  - operate on list of elements returned from selector
  selector:   "string",              # required - string containing a CSS selector or XPath expression
  xpath:      true|false             # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-add-css-class`
* `cable-ready:after-add-css-class`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

## remove\_attribute

Removes an attribute from an element.

```ruby
cable_ready["MyChannel"].remove_attribute(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # required - the attribute to remove
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-attribute`
* `cable-ready:after-remove-attribute`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

## remove\_css\_class

Removes a CSS class from an element.

```ruby
cable_ready["MyChannel"].remove_css_class(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # [null]   - string containing the CSS class name to remove
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

Use an array to removes multiple classes from an element.

```ruby
cable_ready["MyChannel"].remove_css_class(
  cancel:     true|false,            # [false]  - cancel the operation (for use on client)
  name:       ["string", "string2"], # [null]   - array with the CSS class names to remove
  select_all: true|false,            # [false]  - operate on list of elements returned from selector
  selector:   "string",              # required - string containing a CSS selector or XPath expression
  xpath:      true|false             # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-css-class`
* `cable-ready:after-remove-css-class`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

## set\_attribute

Sets an attribute on an element.

```ruby
cable_ready["MyChannel"].set_attribute(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # required - the attribute to set
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  value:      "string",   # [null]   - the value to assign to the attribute
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

Setting an attribute changes the element's HTML, and you will see it reflected in your browser's element inspector. Conversely, properties reflect the live state of the DOM element created by interpreting the HTML.

While there is frequently a 1:1 mapping between attributes and properties, there is [a long list of gotchas](https://javascript.info/dom-attributes-and-properties). For example, changing the `value` attribute of a text input element does not change the current `value` property, or vice versa. Many debugging sessions conclude with frustration over the many attribute vs property gotchas. 

{% hint style="warning" %}
To set the value of a Boolean attribute, such as `disabled`, you can specify any value. An empty string or the name of the attribute are recommended values. All that matters is that if the attribute is present at all, _regardless of its actual value_, its value is considered to be `true`. The absence of the attribute means its value is `false`. By setting the value of the `disabled` attribute to the empty string \(`""`\), we are setting `disabled` to `true`, which results in the button being disabled.
{% endhint %}

#### Life-cycle Callback Events

* `cable-ready:before-set-attribute`
* `cable-ready:after-set-attribute`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

## set\_dataset\_property

Sets an dataset property \(data-\* attribute\) on an element.

```ruby
cable_ready["MyChannel"].set_dataset_property(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # required - the property to set
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  value:      "string",   # [null]   - the value to assign to the dataset
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

This method pairs extremely well with the new [Values](https://stimulus.hotwire.dev/reference/values) API in Stimulus 2, which allows you to specify certain dataset properties to monitor for changes. In addition to providing an excellent way to pass initialization settings to a controller, Stimulus will also execute a special callback if the dataset value is changed:

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

## set\_property

Sets a valid property on an element to a new value.

```ruby
cable_ready["MyChannel"].set_property(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # required - string containing a valid property
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  value:      "string",   # [null]   - the value to assign to the property
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

As discussed in the `set_attribute` description above, properties are the run-time characteristics of HTML that has been parsed and converted to a DOM element.

There are many concepts from the HTML markup that don't map cleanly to the JS representation - such as `class` vs. `className` for CSS classes - since `class` is a reserved word in Javascript.

While DOM elements have many standard properties, you can assign additional properties arbitrarily so long as you don't conflict with an existing property. This technique is known as "hanging" variables on DOM elements, and can be a very powerful tool. Remember: it's possible to hang variables off `document` and `window` if need be.

#### Life-cycle Callback Events

* `cable-ready:before-set-property`
* `cable-ready:after-set-property`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working\_with\_Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)

## set\_style

Sets a single style on an element.

```ruby
cable_ready["MyChannel"].set_style(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  name:       "string",   # required - the style to set
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  value:      "string",   # [null]   - the value to assign to the style
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-style`
* `cable-ready:after-set-style`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

## set\_styles

Sets multiple styles on an element. 

```ruby
cable_ready["MyChannel"].set_styles(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  styles: {
    background: "red",
    color: "white"
  },
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-styles`
* `cable-ready:after-set-styles`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

## set\_value

Sets the value of an element.

```ruby
cable_ready["MyChannel"].set_value(
  cancel:     true|false, # [false]  - cancel the operation (for use on client)
  select_all: true|false, # [false]  - operate on list of elements returned from selector
  selector:   "string",   # required - string containing a CSS selector or XPath expression
  value:      "string",   # [null]   - the value to assign to the attribute
  xpath:      true|false  # [false]  - process the selector as an XPath expression
)
```

{% hint style="warning" %}
Remember, setting the `value` property of a DOM element will not add or modify any `value` attribute on the element.
{% endhint %}

#### Life-cycle Callback Events

* `cable-ready:before-set-value`
* `cable-ready:after-set-value`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)

