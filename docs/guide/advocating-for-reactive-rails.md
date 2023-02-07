# Advocating for "Reactive Rails"

A recent back-of-the-napkin tally suggests that roughly 75% of the time spent building a rich client UI using traditional means is spent synchronizing state between the client and server, and responding to changes - validating inputs, showing/hiding things... you know the drill.

With Server Side Rendering + jQuery, you're dealing with the ever-increasing complexity of page load events, success/failure handling for Ajax calls, and whatever else your app does.

With a JSON API + SPA (such as React or Vue), you're shuttling payloads, choosing between SaaS authentication providers and doing all of the same shit that you were trying to do with jQuery, but pushing the food around on your plate so the complexity shifts to a different shape.**\***

Rails with CableReady and StimulusReflex is an opportunity to fully capture and track the client-side UI state on the server. They let you play back the minimum commands required to display the current Single Source of Truth, which is the server.

The "simple" act of releasing yourself from attempting to sync client state almost completely cancels out the complexity _assumed_ to come with web development, because keeping track of everything on the server turns out to be really, really easy.

The spread between what They are doing and what We are doing provides a reliable and on-going [surplus](https://www.youtube.com/watch?v=4PVViBjukAE) which can be used to build more or faster, depending on your priorities and motivations. This is why we see more and more testimonials from developers who have replaced 30,000 lines of React code with 3,000 lines of Reactive Rails.

These numbers are real, and they check out; you can't beat an incumbent by being 5-10% better. You have to be 10x better than what's currently on offer. That's why Rails ascended to greatness so quickly in 2004, and it's the opportunity our community has again today. There is no greater evidence than the recent shift from being ignored, to being ridiculed, and currently, to being seen as a threat.

Next: we win.

\*jQuery loyalists are by now used to people pointing out their gray hairs, long-winded anecdotes about punch card debugging, dated cultural references and inability to appreciate the "modern JS ecosystem". However, most React developers are not yet ready to hear that React might already be locked into a trending roll towards obsolescence... so be kind.

![](/what_a_racket.jpg)
