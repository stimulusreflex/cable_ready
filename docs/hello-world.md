---
description: Minimum Viable CableReady.
---

# Hello World

One of the most powerful and creatively interesting features of CableReady is that it can be called from [any](cableready-everywhere.md) part of your Rails application. And thanks to the new [`stream_from`](stream_from.md) feature in CableReady v5, you can use it without any client configuration.

Just use a `stream_from` helper in your template wherever you need [Reactive](https://obie.medium.com/react-is-dead-long-live-reactive-rails-long-live-stimulusreflex-and-viewcomponent-cd061e2b0fe2) functionality:

```text
<%= stream_from :foo %>
What did the agnostic, dyslexic insomniac do? 
```

Everyone looking at this page - or any other page which is subscribed to `:foo` - will instantly see an update when the following code executes in a controller action, Reflex class, or ActiveJob:

```ruby
cable_ready[:foo]
  .append(html: "They lay awake, wondering if there is a dog.")
  .broadcast
```

We're taking some liberties for brevity - the default CSS selector target for [every operation](reference/operations/) is `document` - but that's basically it. You just ran code on the server that dynamically updated text on the client for one or many visitors without writing any JavaScript.

There's no limit \(within reason\) to how many subscriptions you can open on a single page, and as you'll soon learn, you can provide many different types of keys, including ActiveRecord model resources, strings, integers, class constants and more.

You could, in theory at least, be done learning CableReady and move on to using the [35 operations](reference/operations/) in real applications, which is pretty surreal and wonderful.

However, most developers will want to learn about how to use Channels. 🚀

