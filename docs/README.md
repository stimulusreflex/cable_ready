---
description: 'Your server-side Ruby can make magic happen on the client, in real-time'
---

# Welcome

![](.gitbook/assets/fantasia%20%281%29.gif)

## What is CableReady?

CableReady is a Ruby gem that lets you **create great real-time user experiences** by triggering client-side DOM changes, events and notifications over [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) web sockets. These commands are called **operations**.

Unlike Ajax calls, operations are not always initiated by user activity. You can broadcast one or **many operations at once** from inside a [Reflex](https://docs.stimulusreflex.com/morph-modes#activejob-example), as well as ActiveRecord callbacks, ActiveJobs, controller actions, rake tasks and in response to API calls and webhooks.

Operations can be broadcast to one person, every person online, or ad hoc groups of people - making real-time notifications, live comments on a blog post, [form validations](https://optimism.leastbad.com/), endless page scrolling and [lazy asset loading](https://github.com/julianrubisch/futurism) laughably trivial.

As the ~~secret weapon~~ primary dependency powering [StimulusReflex](https://docs.stimulusreflex.com/), CableReady establishes a standard for programmatically updating browser state **with no need for custom JavaScript.**

{% hint style="success" %}
**Get Involved.** We are stronger together! Please join us in \#cableready on [Discord.![](https://img.shields.io/discord/629472241427415060)](https://discord.gg/XveN625)

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)
{% endhint %}

## Why should I use CableReady?

Perhaps you've grown tired of the ever-growing complexity of the JS ecosystem. Single Page Applications are frequently lauded as the _only_ way to build "modern" sites... even though we remember how easily one person could build powerful sites with Rails in [2004](https://www.youtube.com/watch?v=SWEts0rlezA&t=214s).

Or maybe you've realized that trying to synchronize state between the client and server _over a stateless protocol_ is a Sisyphean task. How much time and energy could we reclaim for more interesting problems if we didn't need to write complex branching UI logic to update what the user sees? 

It all comes down to [The Great Surplus](https://youtu.be/4PVViBjukAE?t=1079).

CableReady enables a radical new style of development, and it can make you literally 10x more productive than people who don't have it. Will you use your surplus for good... or for _awesome?_

### Goals

* [x] Build reactive UIs without client state 🥏
* [x] Break free of the request-response lifecycle 🤹
* [x] Increase functionality, not complexity 🪁
* [x] Act as a force multiplier for StimulusJS 🔨

## How does it work?

CableReady builds on top of ActionCable and allows you to emit DOM instructions from the server that are automatically executed on the client. It expands the role of web sockets in the Rails ecosystem and elevates Rails as a viable highly performant **alternative to the Single Page App**.

{% hint style="info" %}
Learn more about [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html) to help you get the most out of CableReady.
{% endhint %}

## What can I do with it?

CableReady supports the following DOM operations that can be triggered from server-side Ruby code.

1. [dispatch\_event](usage/dom-operations/event-dispatch.md#dispatchevent)
2. [morph](usage/dom-operations/element-mutations.md#morph)
3. [inner\_html](usage/dom-operations/element-mutations.md#innerhtml)
4. [outer\_html](usage/dom-operations/element-mutations.md#outerhtml)
5. [insert\_adjacent\_html](usage/dom-operations/element-mutations.md#insertAdjacentHTML)
6. [insert\_adjacent\_text](usage/dom-operations/element-mutations.md#insertadjacenttext)
7. [remove](usage/dom-operations/element-mutations.md#remove)
8. [set\_property](usage/dom-operations/element-mutations.md#setproperty)
9. [set\_value](usage/dom-operations/element-mutations.md#setvalue)
10. [set\_attribute](usage/dom-operations/attribute-mutations.md#setattribute)
11. [remove\_attribute](usage/dom-operations/attribute-mutations.md#removeattribute)
12. [add\_css\_class](usage/dom-operations/css-class-mutations.md#addcssclass)
13. [remove\_css\_class](usage/dom-operations/css-class-mutations.md#removecssclass)
14. [set\_style](usage/dom-operations/css-class-mutations.md#setstyle)
15. [set\_styles](usage/dom-operations/css-class-mutations.md#setstyles)
16. [set\_dataset\_property](usage/dom-operations/dataset-mutations.md#setdatasetproperty)
17. [text\_content](usage/dom-operations/element-mutations.md#textcontent)
18. [set\_cookie](usage/dom-operations/cookies.md#setcookie)
19. [console\_log](usage/dom-operations/notifications.md#consolelog)
20. [notification](usage/dom-operations/notifications.md#notification)

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

