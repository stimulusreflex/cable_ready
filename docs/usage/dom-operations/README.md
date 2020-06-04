---
description: All DOM operations that can be triggered from the server with CableReady
---

# DOM Operations

{% hint style="success" %}
It's possible to invoke multiple DOM operations with a single ActionCable broadcast.
{% endhint %}

{% hint style="success" %}
All DOM mutations have corresponding `before/after` events triggered on `document`. Arguments from the server can be accessed via `event.detail`.
{% endhint %}

## [Event Dispatch](event-dispatch.md)

* [dispatchEvent](event-dispatch.md#dispatchevent)

## [Element Mutations](element-mutations.md)

* [morph](element-mutations.md#morph)
* [innerHTML](element-mutations.md#innerhtml)
* [outerHTML](element-mutations.md#outerhtml)
* [insertAdjacentHTML](element-mutations.md#insertAdjacentHTML)
* [insertAdjacentText](element-mutations.md#insertadjacenttext)
* [remove](element-mutations.md#remove)
* [setProperty](element-mutations.md#setproperty)
* [setValue](element-mutations.md#setvalue)

## [Attribute Mutations](attribute-mutations.md)

* [setAttribute](attribute-mutations.md#setattribute)
* [removeAttribute](attribute-mutations.md#removeattribute)

## [CSS Class Mutations](css-class-mutations.md)

* [addCssClass](css-class-mutations.md#addcssclass)
* [removeCssClass](css-class-mutations.md#removecssclass)

## [Style Mutations](style-mutations.md)

* [setStyle](style-mutations.md#setstyle)

## [Dataset Mutations](dataset-mutations.md)

* [setDatasetProperty](dataset-mutations.md#setdatasetproperty)

## Helpful Tips

{% hint style="info" %}
The `selector` option uses [document.querySelector\(\)](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to find the element. If more than one element matches the selector, only the first element will be affected.
{% endhint %}

{% hint style="info" %}
[XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) expressions can also be used if the `xpath` option is set to `true`. As with CSS selectors, the XPath expression must resolve to a single element and not a collection.
{% endhint %}

{% tabs %}
{% tab title="app/models/user.rb" %}
```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content(
      xpath: true,
      selector: "/html/body/div[1]/form/input[1]", 
      text: name
    ) 
    cable_ready.broadcast
  end
end
```
{% endtab %}
{% endtabs %}

