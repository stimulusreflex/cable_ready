---
description: DOM operations you can leverage with CableReady
---

## Supported DOM Operations

### [DOM Events](dom-operations/dom-events.md)
- [dispatchEvent](dom-operations/dom-events.md#dispatchevent)

### [Element Mutations](dom-operations/element-mutations.md)
- [morph](dom-operations/element-mutations.md#morph)
- [innerHTML](dom-operations/element-mutations.md#innerhtml)
- [outerHTML](dom-operations/element-mutations.md#outerhtml)
- [insertAdjacentHTML](dom-operations/element-mutations.md#insertAdjacentHTML)
- [insertAdjacentText](dom-operations/element-mutations.md#insertadjacenttext)
- [remove](dom-operations/element-mutations.md#remove)
- [setValue](dom-operations/element-mutations.md#setvalue)

### [Attribute Mutations](dom-operations/attribute-mutations.md)
- [setAttribute](dom-operations/attribute-mutations.md#setattribute)
- [removeAttribute](dom-operations/attribute-mutations.md#removeattribute)

### [CSS Class Mutations](dom-operations/css-class-mutations.md)
- [addCssClass](dom-operations/css-class-mutations.md#addcssclass)
- [removeCssClass](dom-operations/css-class-mutations.md#removecssclass)

### [Dataset Mutations](dom-operations/dataset-mutations.md)
- [setDatasetProperty](dom-operations/dataset-mutations.md#setdatasetproperty)

{% hint style="info" %}
The `selector` options use [document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to find an element by default. [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) expressions can also be used if the `xpath` option is set to `true`. As with CSS selectors, the XPath expression must resolve to a single element and not a collection.
{% endhint %}

{% hint style="info" %}
It's possible to invoke multiple DOM operations with a single ActionCable broadcast.
{% endhint %}

{% hint style="info" %}
All DOM mutations have corresponding `before/after` events triggered on `document`. These events expose `event.detail` set to the arguments from the server.
{% endhint %}
