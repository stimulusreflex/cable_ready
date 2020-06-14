---
description: >-
  CableReady completes the ActionCable story and expands the utility of web
  sockets in your Rails app
---

# Welcome

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)

## Why CableReady?

CableReady helps you **create great real-time user experiences** by making it simple to trigger client-side DOM changes from server-side Ruby. It establishes a standard for interacting with the client via [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) web sockets. **No need for custom JavaScript.**

Possible interactions range from updating a single element's value to replacing entire sections of content. You can even dispatch client-side DOM events from the server. Also, updates don't need to be initiated by the user. For example, CableReady can update your UI in response to things happening on the server, such as long running ActiveJobs or activity from API calls and webhooks. It's never been easier to notify users of site wide activity.

## How does it work?

CableReady builds on top of ActionCable and allows you to emit DOM instructions from the server that are automatically executed on the client. It expands the role of web sockets in the Rails ecosystem and elevates Rails as a viable highly performant **alternative to the Single Page App**.

{% hint style="info" %}
Learn more about [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html) to help you get the most out of CableReady.
{% endhint %}

## What can I do with it?

CableReady supports the following DOM operations that can be triggered from server-side Ruby code.

1. [dispatchEvent](usage/dom-operations/event-dispatch.md#dispatchevent)
2. [morph](usage/dom-operations/element-mutations.md#morph)
3. [innerHTML](usage/dom-operations/element-mutations.md#innerhtml)
4. [outerHTML](usage/dom-operations/element-mutations.md#outerhtml)
5. [insertAdjacentHTML](usage/dom-operations/element-mutations.md#insertAdjacentHTML)
6. [insertAdjacentText](usage/dom-operations/element-mutations.md#insertadjacenttext)
7. [remove](usage/dom-operations/element-mutations.md#remove)
8. [setProperty](usage/dom-operations/element-mutations.md#setproperty)
9. [setValue](usage/dom-operations/element-mutations.md#setvalue)
10. [setAttribute](usage/dom-operations/attribute-mutations.md#setattribute)
11. [removeAttribute](usage/dom-operations/attribute-mutations.md#removeattribute)
12. [addCssClass](usage/dom-operations/css-class-mutations.md#addcssclass)
13. [removeCssClass](usage/dom-operations/css-class-mutations.md#removecssclass)
14. [setStyle](usage/dom-operations/css-class-mutations.md#setstyle)
15. [setStyles](usage/dom-operations/css-class-mutations.md#setstyles)
16. [setDatasetProperty](usage/dom-operations/dataset-mutations.md#setdatasetproperty)
17. [textContent](usage/dom-operations/element-mutations.md#textcontent)
18. [setCookie](usage/dom-operations/cookies.md#setcookie)

As with other new tools, the potential use cases are only limited by your imagination. For example, CableReady provides the foundation for incredible libraries like [StimulusReflex](https://docs.stimulusreflex.com).

## Can I see an example?

This is a simple example that demonstrates how to set an element's value.

```ruby
cable_ready["MyChannel"].set_value(
  selector: "#my-element", 
  value: "A new value from the server"
)
cable_ready.broadcast
```

{% hint style="warning" %}
In this example, all clients connected to `MyChannel` will receive the broadcast and will update the DOM element to the new value.
{% endhint %}

