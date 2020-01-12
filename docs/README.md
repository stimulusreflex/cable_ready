---
description: >-
  CableReady finishes the story started by ActionCable and takes it from message
  bus to magic
---

# Welcome

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)

## Why CableReady?

CableReady enables triggering **client-side DOM operations from server-side Ruby** code. Imagine updating progress bars, setting visual counters, or displaying messages - all from the server. **No need for custom JavaScript.** 

It's simple. We leverage [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) to emit instructions from the server that are then executed on the client. The possibilities are endless. _You'll be finishing features before your peers have updated their Webpack config._

{% hint style="info" %}
Lean more about [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html) to help you get the most out of CableReady.
{% endhint %}

## What Can I do with it?

CableReady supports the following DOM operations that can be triggered from server-side Ruby code. 

1. [dispatchEvent](usage/dom-operations/event-dispatch.md#dispatchevent)
2. [morph](usage/dom-operations/element-mutations.md#morph)
3. [innerHTML](usage/dom-operations/element-mutations.md#innerhtml)
4. [outerHTML](usage/dom-operations/element-mutations.md#outerhtml)
5. [insertAdjacentHTML](usage/dom-operations/element-mutations.md#insertAdjacentHTML)
6. [insertAdjacentText](usage/dom-operations/element-mutations.md#insertadjacenttext)
7. [remove](usage/dom-operations/element-mutations.md#remove)
8. [setValue](usage/dom-operations/element-mutations.md#setvalue)
9. [setAttribute](usage/dom-operations/attribute-mutations.md#setattribute)
10. [removeAttribute](usage/dom-operations/attribute-mutations.md#removeattribute)
11. [addCssClass](usage/dom-operations/css-class-mutations.md#addcssclass)
12. [removeCssClass](usage/dom-operations/css-class-mutations.md#removecssclass)
13. [setDatasetProperty](usage/dom-operations/dataset-mutations.md#setdatasetproperty)

The potential use cases are unlimited. For example, CableReady provides the foundation for incredible libraries like [StimulusReflex](https://docs.stimulusreflex.com).

