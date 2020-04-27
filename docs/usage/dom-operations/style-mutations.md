# Style Mutations

## [setStyle](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

Sets a single style on an element.

```ruby
cable_ready["MyChannel"].set_style(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string", # required - the style to set
  value:    "string"  # [null]   - the value to assign to the style
)
```

### JavaScript Events

* `cable-ready:before-set-style`
* `cable-ready:after-set-style`

