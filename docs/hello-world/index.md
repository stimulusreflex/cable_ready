---
description: 'Real-time changes in the browser, controlled by server-side Ruby.'
---

# Welcome

## What is CableReady?

CableReady offers 36 different [operations](./#what-can-i-do-with-cableready) that let you **create reactive user experiences** without the need for complex SPA frameworks.

The CableReady client is language, framework and transport agnostic. **If your server can create JSON, you can use CableReady.**

![](/fantasia.gif)

**Operations** are typically responses to [user activity](https://stimulusreflex.com), but can also be created by jobs or other external events.

**Broadcasts** can be delivered to one person, everyone online, or ad hoc groups of thousands. Real-time notifications, live comments on a blog post, [form validations](https://optimism.leastbad.com/), collaborative editing, shared media viewing, endless page scrolling and [lazy asset loading](https://github.com/julianrubisch/futurism) become easy wins.

::: tip
**Get Involved.** We are stronger together! Please join us in `#cableready` on [Discord.![](https://img.shields.io/discord/629472241427415060)](https://discord.gg/stimulus-reflex)

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)
:::

## How should I use CableReady?

#### With WebSockets

As the ~~secret weapon~~ primary dependency powering [StimulusReflex](https://docs.stimulusreflex.com/), CableReady is the standard mechanism for controlling the browser **with no need for custom JavaScript.**

#### With Ajax

New in v5, the [Cable Car](/guide/cable-car) API allows developers to create a CableReady JSON payload. You're covered, whether you're using the amazing [Mrujs](https://mrujs.com) or `fetch`ing data from URLs.

## Why should I use CableReady?

Perhaps you've grown tired of the ever-growing complexity of the JS ecosystem. Single Page Applications are frequently lauded as the _only_ way to build "modern" sites... even though we remember how easily one person could build powerful sites with Rails in [2004](https://www.youtube.com/watch?v=SWEts0rlezA&t=214s).

Or maybe you've realized that trying to synchronize state between the client and server _over a stateless protocol_ is a Sisyphean task. How much time and energy could we reclaim for more interesting problems if we didn't need to write complex branching UI logic to update what the user sees?

It all comes down to [The Great Surplus](https://youtu.be/4PVViBjukAE?t=1079).

CableReady enables a radical new style of development, and **it can make you literally 10x more productive than teams not using it**. Will you use your surplus for good... or for _awesome?_

### Goals

* Build reactive UIs without client state 🥏
* Break free of the request-response lifecycle 🤹
* Increase functionality, not complexity 🪁
* Act as a force multiplier for StimulusJS 🔨

## What can I do with CableReady?

CableReady currently boasts **36 different operations** that can be triggered from server-side Ruby code:

|  | Operations Available |
| :--- | :--- |
| [DOM Mutations](/reference/operations/dom-mutations) | [`append`](/reference/operations/dom-mutations#append), [`graft`](/reference/operations/dom-mutations#graft), [`inner_html`](/reference/operations/dom-mutations#inner_html), [`insert_adjacent_html`](/reference/operations/dom-mutations#insert_adjacent_html), [`insert_adjacent_text`](/reference/operations/dom-mutations#insert_adjacent_text), [`morph`](/reference/operations/dom-mutations#morph), [`outer_html`](/reference/operations/dom-mutations#outer_html), [`prepend`](/reference/operations/dom-mutations#prepend), [`remove`](/reference/operations/dom-mutations#remove), [`replace`](/reference/operations/dom-mutations#replace), [`text_content`](/reference/operations/dom-mutations#text_content) |
| [Element Property Mutations](/reference/operations/element-mutations) | [`add_css_class`](/reference/operations/element-mutations#add_css_class), [`remove_attribute`](/reference/operations/element-mutations#remove_attribute), [`remove_css_class`](/reference/operations/element-mutations#remove_css_class), [`set_attribute`](/reference/operations/element-mutations#set_attribute), [`set_dataset_property`](/reference/operations/element-mutations#set_dataset_property), [`set_property`](/reference/operations/element-mutations#set_property), [`set_style`](/reference/operations/element-mutations#set_style), [`set_styles`](/reference/operations/element-mutations#set_styles), [`set_value`](/reference/operations/element-mutations#set_value) |
| [DOM Events](/reference/operations/event-dispatch) | [`dispatch_event`](/reference/operations/event-dispatch#dispatch_event), [`set_meta`](/reference/operations/event-dispatch#set_meta) |
| [Browser Manipulations](/reference/operations/browser-manipulations) | [`clear_storage`](/reference/operations/browser-manipulations#clear_storage), [`go`](/reference/operations/browser-manipulations#go), [`push_state`](/reference/operations/browser-manipulations#push_state), [`redirect_to`](/reference/operations/browser-manipulations#redirect_to), [`remove_storage_item`](/reference/operations/browser-manipulations#remove_storage_item), [`replace_state`](/reference/operations/browser-manipulations#replace_state), [`scroll_into_view`](/reference/operations/browser-manipulations#scroll_into_view), [`set_cookie`](/reference/operations/browser-manipulations#set_cookie), [`set_focus`](/reference/operations/browser-manipulations#set_focus), [`set_storage_item`](/reference/operations/browser-manipulations#set_storage_item), [`set_title`](/reference/operations/browser-manipulations#set_title) |
| [Notifications](/reference/operations/notifications) | [`console_log`](/reference/operations/notifications#console_log), [`console_table`](/reference/operations/notifications#console_table), [`notification`](/reference/operations/notifications#notification), [`play_sound`](/reference/operations/notifications#play_sound) |
