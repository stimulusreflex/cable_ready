# Attribute Mutations

## [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)

Sets an attribute on an element.

```ruby
cable_ready["MyChannel"].set_attribute(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string", # required - the attribute to set
  value:    "string"  # [null]   - the value to assign to the attribute
)
```

### JavaScript Events

* `cable-ready:before-set-attribute`
* `cable-ready:after-set-attribute`

## [removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute)

Removes an attribute from an element.

```ruby
cable_ready["MyChannel"].remove_attribute(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string"  # required - the attribute to remove
)
```

### JavaScript Events

* `cable-ready:before-remove-attribute`
* `cable-ready:after-remove-attribute`

