# CSS Class Mutations

## [addCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Adds a CSS class to an element.
This is a `noop` if the CSS class is already assigned.

{% code-tabs %}
{% code-tabs-item %}
```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to add
)
```
{% endcode-tabs-item %}
{% endcode-tabs %}


### JavaScript Events

- `cable-ready:before-add-css-class`
- `cable-ready:after-add-css-class`

## [removeCssClass](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

Removes a CSS class from an element.

{% code-tabs %}
{% code-tabs-item %}
```ruby
cable_ready["MyChannel"].add_css_class(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # [null]   - the CSS class to remove
)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### JavaScript Events

- `cable-ready:before-remove-css-class`
- `cable-ready:after-remove-css-class`
