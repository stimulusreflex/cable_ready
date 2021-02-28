---
description: 'Server-side Ruby making magic happen on the client, in real-time'
---

# Welcome

## What is CableReady?

CableReady is a Ruby gem that was first released in May 2017. It lets you **create great real-time user experiences** by triggering client-side DOM changes, events and notifications over [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) web sockets. These commands are called **operations**.

![](.gitbook/assets/fantasia.gif)

Unlike Ajax requests, operations are not always initiated by user activity - or even the user's browser.

You can broadcast one or **many operations at once** from inside a [Reflex](https://docs.stimulusreflex.com/morph-modes#activejob-example), as well as ActiveRecord callbacks, ActiveJobs, ActionCable Channels, controller actions, rake tasks and in response to API calls and webhooks.

Operations can be broadcast to one person, every person online, or ad hoc groups of people - making real-time notifications, live comments on a blog post, [form validations](https://optimism.leastbad.com/), collaborative editing, shared media viewing, endless page scrolling and [lazy asset loading](https://github.com/julianrubisch/futurism) laughably trivial.

As the ~~secret weapon~~ primary dependency powering [StimulusReflex](https://docs.stimulusreflex.com/), CableReady establishes a standard for programmatically updating browser state **with no need for custom JavaScript.**

{% hint style="success" %}
**Get Involved.** We are stronger together! Please join us in \#cableready on [Discord.![](https://img.shields.io/discord/629472241427415060)](https://discord.gg/stimulus-reflex)

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)
{% endhint %}

## Why should I use CableReady?

Perhaps you've grown tired of the ever-growing complexity of the JS ecosystem. Single Page Applications are frequently lauded as the _only_ way to build "modern" sites... even though we remember how easily one person could build powerful sites with Rails in [2004](https://www.youtube.com/watch?v=SWEts0rlezA&t=214s).

Or maybe you've realized that trying to synchronize state between the client and server _over a stateless protocol_ is a Sisyphean task. How much time and energy could we reclaim for more interesting problems if we didn't need to write complex branching UI logic to update what the user sees?

It all comes down to [The Great Surplus](https://youtu.be/4PVViBjukAE?t=1079).

CableReady enables a radical new style of development, and **it can make you literally 10x more productive than people who don't have it**. Will you use your surplus for good... or for _awesome?_

### Goals

* [x] Build reactive UIs without client state 🥏
* [x] Break free of the request-response lifecycle 🤹
* [x] Increase functionality, not complexity 🪁
* [x] Act as a force multiplier for StimulusJS 🔨

{% embed url="https://www.youtube.com/watch?v=F5hA79vKE\_E" caption="" %}

### Upgrade from Hotwire Turbo Streams

We welcome [Hotwire](https://hotwire.dev) to the \#resistance, albeit a bit more than stylishly late to the party.

Since its release in late 2020, Rails developers have been eagerly digging into their new tooling. Inevitably, people ask how it stacks up to CableReady and StimulusReflex.

While any answer will be nuanced and biases controlled for, we see the Turbo eventually providing an excellent successor for Rails UJS and acting as a launchboard to Reactive Rails UI design.

We're confident calling CableReady an upgrade path from [Turbo Streams](https://turbo.hotwire.dev/handbook/streams). CableReady supports 5x more operations and is designed for extreme flexibility; it can be used almost anywhere in your app.

Moreover, developers can use CableReady to broadcast operations to ad hoc groups of both people and resources [in a way that enables developers to build applications not easily possible](broadcasting-to-resources.md#fewer-promises-more-consciousness-expanding-code-samples-plz) with other tools.

## What can I do with CableReady?

CableReady currently boasts **33 different operations** that can be triggered from server-side Ruby code:

|  | Operations Available |
| :--- | :--- |
| [DOM Mutations](reference/operations/dom-mutations.md) | [append](reference/operations/dom-mutations.md#append), [graft](reference/operations/dom-mutations.md#graft), [inner\_html](reference/operations/dom-mutations.md#inner_html), [insert\_adjacent\_html](reference/operations/dom-mutations.md#insert_adjacent_html), [insert\_adjacent\_text](reference/operations/dom-mutations.md#insert_adjacent_text), [morph](reference/operations/dom-mutations.md#morph), [outer\_html](reference/operations/dom-mutations.md#outer_html), [prepend](reference/operations/dom-mutations.md#prepend), [remove](reference/operations/dom-mutations.md#remove), [replace](reference/operations/dom-mutations.md#replace), [text\_content](reference/operations/dom-mutations.md#text_content) |
| [Element Property Mutations](reference/operations/element-mutations.md) | [add\_css\_class](reference/operations/element-mutations.md#add_css_class), [remove\_attribute](reference/operations/element-mutations.md#remove_attribute), [remove\_css\_class](reference/operations/element-mutations.md#remove_css_class), [set\_attribute](reference/operations/element-mutations.md#set_attribute), [set\_dataset\_property](reference/operations/element-mutations.md#set_dataset_property), [set\_property](reference/operations/element-mutations.md#set_property), [set\_style](reference/operations/element-mutations.md#set_style), [set\_styles](reference/operations/element-mutations.md#set_styles), [set\_value](reference/operations/element-mutations.md#set_value) |
| [DOM Events](reference/operations/event-dispatch.md) | [dispatch\_event](reference/operations/event-dispatch.md#dispatch_event) |
| [Browser Manipulations](reference/operations/browser-manipulations.md) | [clear\_storage](reference/operations/browser-manipulations.md#clear_storage), [go](reference/operations/browser-manipulations.md#go), [push\_state](reference/operations/browser-manipulations.md#push_state), [remove\_storage\_item](reference/operations/browser-manipulations.md#remove_storage_item), [replace\_state](reference/operations/browser-manipulations.md#replace_state), [scroll\_into\_view](reference/operations/browser-manipulations.md#scroll_into_view), [set\_cookie](reference/operations/browser-manipulations.md#set_cookie), [set\_focus](reference/operations/browser-manipulations.md#set_focus), [set\_storage\_item](reference/operations/browser-manipulations.md#set_storage_item) |
| [Notifications](reference/operations/notifications.md) | [console\_log](reference/operations/notifications.md#console_log), [notification](reference/operations/notifications.md#notification), [play\_sound](reference/operations/notifications.md#play_sound) |

