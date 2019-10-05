---
description: DOM operations you can leverage with CableReady
---

# Supported DOM Operations

{% hint style="success" %}
It's possible to invoke multiple DOM operations with a single ActionCable broadcast.
{% endhint %}

{% hint style="success" %}
All DOM mutations have corresponding `before/after` events triggered on `document`. Arguments from the server can be accessed via `event.detail`.
{% endhint %}

{% hint style="info" %}
The `selector` options use [document.querySelector\(\)](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to find an element by default. [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) expressions can also be used if the `xpath` option is set to `true`. As with CSS selectors, the XPath expression must resolve to a single element and not a collection.
{% endhint %}

## [DOM Events](dom-events.md)

* [dispatchEvent](dom-events.md#dispatchevent)

## [Element Mutations](element-mutations.md)

* [morph](element-mutations.md#morph)
* [innerHTML](element-mutations.md#innerhtml)
* [outerHTML](element-mutations.md#outerhtml)
* [insertAdjacentHTML](element-mutations.md#insertAdjacentHTML)
* [insertAdjacentText](element-mutations.md#insertadjacenttext)
* [remove](element-mutations.md#remove)
* [setValue](element-mutations.md#setvalue)

## [Attribute Mutations](attribute-mutations.md)

* [setAttribute](attribute-mutations.md#setattribute)
* [removeAttribute](attribute-mutations.md#removeattribute)

## [CSS Class Mutations](css-class-mutations.md)

* [addCssClass](css-class-mutations.md#addcssclass)
* [removeCssClass](css-class-mutations.md#removecssclass)

## [Dataset Mutations](dataset-mutations.md)

* [setDatasetProperty](dataset-mutations.md#setdatasetproperty)

