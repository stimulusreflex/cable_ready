# Morph Sanity Checklist

[`morphdom`](https://github.com/patrick-steele-idem/morphdom) can be a fickle muse.

There are rules you must follow to achieve successful results when using the [`morph`](/reference/operations/dom-mutations.md#morph) operation, especially when setting `childrenOnly: true` . Confusion arises when developers don't take care to verify that the outer-most container element of the content they are providing must match the element that you're morphing into, even though that outer-most container element will be discarded during the morph process.

We've done our best to collect most of the typical gotchas one might encounter in one place. The following examples assume the following div is the content which will be morphed.

```html
<div id="foo">Your muscles... they are so tight.</div>
```

#### You cannot change the attributes of your morph target.

Even if you maintain the same CSS selector, you cannot modify any attributes (including data attributes) of the container element with the `morph` operation.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"foo\" data-muscles=\"sore\">data-muscles will not be set.</div>"
  )
```

You might consider using one of the other CableReady operations like [`outer_html`](/reference/operations/dom-mutations.md#outer_html) or [`set_attribute`](/reference/operations/element-mutations.md#set_attribute) instead.

#### Your top-level content needs to be an element.

It's not enough for the container selector to match. Your content needs to be wrapped in an element (eg. not a text node) or else the StimulusReflex `data-reflex-permanent` attribute will not work.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"foo\"><p>Strengthen your core.</p></div>"
  )
```

#### No closing tag? No problem.

Inexplicably, morphdom just doesn't seem to care if your top-level element node is closed.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"foo\"><span>Who needs muscl</span>"
  )
```

#### Different element type altogether? Who cares, so long as the CSS selector matches?

Go ahead, turn your `div` into a `span`. `morphdom` just doesn't care.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<span id=\"foo\">Are these muscles or rocks? lol</span>"
  )
```

#### A new CSS selector (or no CSS selector) will be processed as innerHTML

Changing the CSS selector will result in some awkward nesting issues.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"baz\">Let me know if this is too strong.</div>"
  )
```

```html
<div id="foo">
  <div id="baz">Let me know if this is too strong.</div>
</div>
```

#### If the element with the CSS selector is surrounded, external content will be discarded.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "I am excited to see your <div id=\"foo\">muscles</div> next week."
  )
```

```html
<div id="foo">muscles</div>
```

#### If an element matches the target CSS selector, other elements will be ignored.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"foo\">Foo!</div><div id=\"post_foo\">Avant-Foo!</div>"
  )
```

```ruby
<div id="foo">Foo!</div>
```

#### This is true even if the elements are reversed.

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"post_foo\">Avant-Foo!</div><div id=\"foo\">Foo!</div>"
  )
```

```ruby
<div id="foo">Foo!</div>
```

#### But it's all good in the hood if the selector is not present. 🤦

```ruby
cable_ready["stream"]
  .morph(
    selector: "#foo",
    html: "<div id=\"mike\">Mike</div> and <div id=\"ike\">Ike</div>"
  )
```

```ruby
<div id="foo">
  <div id="mike">Mike</div>
  and
  <div id="ike">Ike</div>
</div>
```

::: tip
If you spot another weird edge case, please let us know!
:::
