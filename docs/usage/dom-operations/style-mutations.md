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

## [setStyles](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)

Sets a multiple styles on an element. This delegates each entry in
`styles` to `setStyle` so you can set multiple values at once.

```ruby
cable_ready["MyChannel"].set_styles(
  selector: "string", # required - string containing a CSS selector or XPath expression
  styles: {
    background: "red",
    color: "white"
  }
)
```
