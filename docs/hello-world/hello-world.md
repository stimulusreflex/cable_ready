---
description: Minimum Viable CableReady
---

# Hello World

One of the most powerful aspects of CableReady is that it can be called from [any](/guide/cableready-everywhere) part of your Rails application. Thanks to the new [`stream_from`](/guide/stream-from) feature in CableReady v5, you can use it without any client configuration.

Drop a `stream_from` helper into your view whenever you need a [Reactive](https://obie.medium.com/react-is-dead-long-live-reactive-rails-long-live-stimulusreflex-and-viewcomponent-cd061e2b0fe2) UX:

```html
<%= stream_from :foo %>
What does the agnostic, dyslexic insomniac do?
```

Everyone looking at this page - or any other page which is subscribed to `:foo` - will instantly see an update when the following Ruby executes:

```ruby
cable_ready[:foo]
  .append("body", html: "They lay awake, wondering if there is a dog.")
  .broadcast
```

Your server-side code just dynamically updated text on potentially thousands of clients, without writing any boilerplate JavaScript or Ruby.

![Jazz Hands](/eunji.gif)

You could, in theory at least, already be done learning CableReady and just start using its [36 operations](/reference/operations/) in your controllers, models, Reflexes and jobs. What a time to be alive! ✨

However, most developers will want to keep reading and learn how to use Channels.
