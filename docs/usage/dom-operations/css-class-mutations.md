# CSS Class Mutations

## [addCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Adds a CSS class to an element. This is a `noop` if the CSS class is already assigned.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to add
)
```

Use an array to sets multiple classes to an element.

```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     ["string", "string2"]  # [null]   - the CSS class to add
)
```

### JavaScript Events

* `cable-ready:before-add-css-class`
* `cable-ready:after-add-css-class`

## [removeCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Removes a CSS class from an element.

```ruby
cable_ready["MyChannel"].remove_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to remove
)
```

Use an array to removes multiple classes from an element.

```ruby
cable_ready["MyChannel"].remove_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     ["string", "string2"]  # [null]   - the CSS class to add
)
```

### JavaScript Events

* `cable-ready:before-remove-css-class`
* `cable-ready:after-remove-css-class`

