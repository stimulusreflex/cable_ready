# `stream_from`

There's no limit \(within reason\) to how many subscriptions you can open on a single page, and as you'll soon learn, you can provide several keys which mix many different types, including ActiveRecord model resources, strings, integers, class constants and more.

## Example time!

We're going to use a ActiveRecord model callbacks to demonstrate updating likes on a Photo resource.

First, let's set up a `/photos` index page and quickly sketch a basic `photo` partial which will provide our user interface:

::: code-group
```html [app/views/photos/index.html.erb]
<h1>Photos!</h1>

<div id="photos">
  <%= render @photos %>
</div>
<%= stream_from Photo %>
```
:::

The `stream_from` helper is an invisible web component that doesn't occupy any space in your layout. By passing it `Photo`, we're telling it to listen for any CableReady broadcasts that specify `Photo` as a key. This implies that you'll be sending updates targeting "all photos", as evidenced by the `div` with the `photos` id which will contain all of the photos.

This is _perfect_ for adding new photos to an existing list. We should keep the `stream_from` helper outside of the `photos` `div` just in case you ever want to update its contents.

::: code-group
```html [app/views/photos/_photo.html.erb]
<div id="<%= dom_id(photo) %>">
  <%= stream_from photo %>

  <img src="<%= photo.path %>" />
  Likes: <%= photo.likes %>

  <%= form_with model: photo, local: false do |form| %>

  <% end %>
</div>
```
:::
