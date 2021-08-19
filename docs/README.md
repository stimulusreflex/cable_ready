---
description: 'Real-time changes in the browser, controlled by server-side Ruby.'
---

# Welcome

## What is CableReady?

CableReady offers 36 different [operations](./#what-can-i-do-with-cableready) that let you **create reactive user experiences** without the need for complex SPA frameworks.

The CableReady client is language, framework and transport agnostic. **If your server can create JSON, you can use CableReady.**

![](.gitbook/assets/fantasia.gif)

**Operations** are typically responses to [user activity](https://stimulusreflex.com), but can also be created by jobs or other external events.

**Broadcasts** can be delivered to one person, everyone online, or ad hoc groups of thousands. Real-time notifications, live comments on a blog post, [form validations](https://optimism.leastbad.com/), collaborative editing, shared media viewing, endless page scrolling and [lazy asset loading](https://github.com/julianrubisch/futurism) become easy wins.

{% hint style="success" %}
**Get Involved.** We are stronger together! Please join us in \#cableready on [Discord.![](https://img.shields.io/discord/629472241427415060)](https://discord.gg/stimulus-reflex)

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)
{% endhint %}

## How should I use CableReady?

#### With WebSockets

As the ~~secret weapon~~ primary dependency powering [StimulusReflex](https://docs.stimulusreflex.com/), CableReady is the standard mechanism for controlling the browser **with no need for custom JavaScript.**

#### With Ajax

New in v5, the [Cable Car](cable-car.md) API allows developers to create a CableReady JSON payload. You're covered, whether you're using the amazing [Mrujs](https://mrujs.com) or `fetch`ing data from URLs.

## Why should I use CableReady?

Perhaps you've grown tired of the ever-growing complexity of the JS ecosystem. Single Page Applications are frequently lauded as the _only_ way to build "modern" sites... even though we remember how easily one person could build powerful sites with Rails in [2004](https://www.youtube.com/watch?v=SWEts0rlezA&t=214s).

Or maybe you've realized that trying to synchronize state between the client and server _over a stateless protocol_ is a Sisyphean task. How much time and energy could we reclaim for more interesting problems if we didn't need to write complex branching UI logic to update what the user sees?

It all comes down to [The Great Surplus](https://youtu.be/4PVViBjukAE?t=1079).

CableReady enables a radical new style of development, and **it can make you literally 10x more productive than teams not using it**. Will you use your surplus for good... or for _awesome?_

### Goals

* [x] Build reactive UIs without client state 🥏
* [x] Break free of the request-response lifecycle 🤹
* [x] Increase functionality, not complexity 🪁
* [x] Act as a force multiplier for StimulusJS 🔨

### Upgrade from Hotwire Turbo Streams

CableReady is an obvious upgrade path from [Turbo Streams](https://turbo.hotwired.dev/handbook/streams). CableReady supports **7x** more operations and is [extremely flexible](cableready-everywhere.md).

Developers can use CableReady to broadcast operations to ad hoc groups of both people and resources [in a way that enables developers to build applications not easily possible](broadcasting-to-resources.md#fewer-promises-more-consciousness-expanding-code-samples-plz) with other tools.

## What can I do with CableReady?

CableReady currently boasts **36 different operations** that can be triggered from server-side Ruby code:

|  | Operations Available |
| :--- | :--- |
| [DOM Mutations](reference/operations/dom-mutations.md) | [append](reference/operations/dom-mutations.md#append), [graft](reference/operations/dom-mutations.md#graft), [inner\_html](reference/operations/dom-mutations.md#inner_html), [insert\_adjacent\_html](reference/operations/dom-mutations.md#insert_adjacent_html), [insert\_adjacent\_text](reference/operations/dom-mutations.md#insert_adjacent_text), [morph](reference/operations/dom-mutations.md#morph), [outer\_html](reference/operations/dom-mutations.md#outer_html), [prepend](reference/operations/dom-mutations.md#prepend), [remove](reference/operations/dom-mutations.md#remove), [replace](reference/operations/dom-mutations.md#replace), [text\_content](reference/operations/dom-mutations.md#text_content) |
| [Element Property Mutations](reference/operations/element-mutations.md) | [add\_css\_class](reference/operations/element-mutations.md#add_css_class), [remove\_attribute](reference/operations/element-mutations.md#remove_attribute), [remove\_css\_class](reference/operations/element-mutations.md#remove_css_class), [set\_attribute](reference/operations/element-mutations.md#set_attribute), [set\_dataset\_property](reference/operations/element-mutations.md#set_dataset_property), [set\_property](reference/operations/element-mutations.md#set_property), [set\_style](reference/operations/element-mutations.md#set_style), [set\_styles](reference/operations/element-mutations.md#set_styles), [set\_value](reference/operations/element-mutations.md#set_value) |
| [DOM Events](reference/operations/event-dispatch.md) | [dispatch\_event](reference/operations/event-dispatch.md#dispatch_event), [set\_meta](reference/operations/event-dispatch.md#set_meta) |
| [Browser Manipulations](reference/operations/browser-manipulations.md) | [clear\_storage](reference/operations/browser-manipulations.md#clear_storage), [go](reference/operations/browser-manipulations.md#go), [push\_state](reference/operations/browser-manipulations.md#push_state), [redirect\_to](reference/operations/browser-manipulations.md#redirect_to), [remove\_storage\_item](reference/operations/browser-manipulations.md#remove_storage_item), [replace\_state](reference/operations/browser-manipulations.md#replace_state), [scroll\_into\_view](reference/operations/browser-manipulations.md#scroll_into_view), [set\_cookie](reference/operations/browser-manipulations.md#set_cookie), [set\_focus](reference/operations/browser-manipulations.md#set_focus), [set\_storage\_item](reference/operations/browser-manipulations.md#set_storage_item) |
| [Notifications](reference/operations/notifications.md) | [console\_log](reference/operations/notifications.md#console_log), [console\_table](reference/operations/notifications.md#console_table), [notification](reference/operations/notifications.md#notification), [play\_sound](reference/operations/notifications.md#play_sound) |

