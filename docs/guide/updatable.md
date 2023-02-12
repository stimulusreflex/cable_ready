# Batteries Included Reactivity ✨ - `CableReady::Updatable`

Imagine that **whenever the state of your application changes** (for example, a record is added, deleted, or modified), all connected users receive **instant, customized view updates**. 

The complexity of this situation lies in the fact that many views in an application are dependent on the attributes of the current user.

- Is she the post **owner**? Then she may delete it, we have to render a "delete" button 🚮.
- Is she a global **administrator**? Then we have to show some additional statistics 📊.
- Is he an **editor**? We have to render an "edit" button 📝.
- and so on...

As complicated as this sounds, we want to deliver the pinnacle of developer experience, so we set out to solve this problem.

## TL;DR

If you are in a hurry, here's the gist of what you have to do to enjoy the magic 🪄:

1. In your model, include the `CableReady::Updatable` module
2. Call `enable_updates` as a class method in your model, or pass `enable_updates: true` to a `has_many` association:

```rb
class Comment < ApplicationRecord
  include CableReady::Updatable

  belongs_to :feed

  enable_updates
end

class Feed < ApplicationRecord   
  include CableReady::Updatable
  
  has_many :comments, enable_updates: true 
end
```

3. Use the `updates_for` view helper to automatically subscribe to any updates the rendered models receive:

```erb
<!-- app/views/feeds/show.html.erb -->
<ul>
  <%= updates_for @feed, :comments do %>
    <%= render @feed.comments %>
  <% end %>
</ul>

<!-- app/views/comments/_comment.html.erb -->
<li>
  <%= comment.title %> - created <%= time_ago_in_words(comment.created_at) %> ago
  <% if comment.owner == current_user %>
    <!-- show dropdown -->
  <% end %>
</li>
```

## API Reference

### Module

**enable_updates**(on:, if:)

Registers `after_commit` callbacks in the background, which initiate Action Cable pings after each write to the database.

Parameters:

- `on:` (optional) limits updates to be triggered to a certain action, or a combination (`:create, :update, :destroy`)

```rb
enable_updates on: :create

enable_updates on: [:update, :destroy]
```

- `if:` (optional) a lambda that can be passed to determine whether to deliver updates: 

```rb
enable_updates if: -> { ready? }
```

### Association Extensions

`CableReady::Updatable` provides convenience extensions for Active Record associations:

#### has_many

You can pass the following arguments to a `has_many` association:

- `enable_updates: true`: This will create a stream identifier so you can subscribe to updates on a collection:

```erb
<%= updates_for @feed, :comments do %>
  <%= render @feed.comments %>
<% end %>
```

- `descendants`: Single Table Inheritance requires us to be explicit about the descendant classes an association could embody.

Suppose we have a class inheritance structure like this:

```rb
class Block < ApplicationRecord
  belongs_to :section
end

class Comment < Block
end
```

If we want our users to receive `Comment` updates, we would have to specify a `has_many` association like this:

```rb
class Section < ApplicationRecord
  include CableReady::Updatable

  has_many :blocks, enable_updates: true, descendants: ["Comment"]
end
```


#### has_one

You can pass the following arguments to a `has_one`:

- `enable_updates: true`: This will create a stream identifier so you can subscribe to updates on the dependent record:

```erb
<%= updates_for @supplier, :account do %>
  <%= render @supplier.account %>
<% end %>
```

#### has_many_attached

For your convenience, we also provide an extension for an Active Storage `has_many_attached` relation:

- `enable_updates: true`: This will create a stream identifier so you can subscribe to updates on all Active Storage attachments

```rb
class Post < ApplicationRecord
  include CableReady::Updatable
  has_many_attached :images, enable_updates: true
end
```

```erb
<%= updates_for @post, :images do %>
  <!-- render images -->
<% end %>
```


### View Helper

**updates_for**(*keys, url: nil, debounce: nil, only: nil, ignore_inner_updates: false, html_options: {}, &block)

This helper method will render a `updates-for` custom HTML element that contains all the JavaScript behavior to

1. **connect to a certain resource** via a generated stream identifier for Action Cable
2. **receive updates** from the server and _morph_ the resulting HTML.

Parameters:

- `keys`: (required) a model reference, or an array splat containing a model reference and an association key, e.g. `@post`, or `@feed, :posts`
- `url:`: (optional) allows you to specify a **different** URL to request the updated HTML payload from than the **current location**.
- `debounce:`: (optional) an integer value denoting the **milliseconds** to debounce updates (default 20)
- `only:`: (optional) enables you to specify an **allow list** of model attributes you want to track updates for
- `ignore_inner_updates:` (optional), a flag to determine whether to trigger updates for state changes emanating from an _inner_ form submit or reflex (default `false`). Essentially enabling this means **do not fire an update for the user who originated the change**, which can solve typical race conditions.
- `html_options:`: (optional) a hash of options to pass to the generated `<updates-for>` tag, e.g. `class`, `data: {}` etc.


## How It Works

Here's a high-level overview of all the participants in this process, and how they interact:

![Updatable Sequence Diagram](/updatable-sequence-diagram.png)

1. It all starts with a database update occurring at the model level. The `CableReady::Updatable` then signals the view via Action Cable that something has changed about it.
2. The view somehow stores the element in focus, if any.
3. Then, the view (or rather, some JavaScript inside it) requests updated content from the controller responsible for the currently active route (a simple GET request).
4. The controller goes through its normal request/response cycle and responds with the according HTML.
5. In a callback, the view patches the affected portions of the DOM via morphdom.
6. The view restores focus.

## Advanced Usage

### GlobalID POROs

`Updatable` can handle POROs that conform to the [Global ID](https://github.com/rails/globalid) protocol. Such POROs only have to declare an `id` instance method and a `find(id)` class method:

```rb
class GlobalIdableEntity
  include GlobalID::Identification
  include CableReady::Updatable

  def id
    "fake-id"
  end

  def self.find(id)
    # somehow find and return an instance of this class
  end

  def fake_update
    CableReady::Updatable::ModelUpdatableCallbacks.new(:update).after_commit(self)
  end
end
```

Observe that of course in such a case the `ActiveRecord::Callbacks` module is missing, so we have to cater for triggering the included callbacks ourselves. In the example above, this is provided by the `fake_update` method.

### Skip Updates

Sometimes you have to bulk update records, such as when performing a data migration. Because such tasks can often happen in an _unsuited environment_ (for example, without connection to Redis), it might be preferable to **opt out of updates**. This can be done by wrapping those CRUD mutations in a `skip_updates` block, which is very similar to Active Record's [no_touching](https://github.com/rails/rails/blob/83217025a171593547d1268651b446d3533e2019/activerecord/lib/active_record/no_touching.rb#L23) implementation:

```rb
# Skips broadcasts for all models inheriting from ApplicationRecord:
ApplicationRecord.skip_updates do
  Comment.update_all(status: :published)
end

# Skips broadcasts for Comment only:
Comment.skip_updates do
  # will not broadcast
  Comment.update_all(status: :published)

  # will broadcast
  Post.update_all(author: nil)
end
```

## Best Practices

### Scope to Required Model Attributes
Each update to an element will lead to the server-triggered request/response cycle outlined above. You can reduce the load on your app server if you aggressively scope your updates to a specified subset of model attributes with `only:`.

### Use Minimal HTML Payloads
One of the major performance bottlenecks regarding `Updatable` is the fact that by default it re-fetches the HTML from the current controller action. This can result in large HTML payloads, but can be mitigated if your view is already decomposed into several [eager/lazy loaded Turbo Frames](https://turbo.hotwired.dev/reference/frames#eager-loaded-frame) (or similar) by specifying a custom `url:` parameter.

## Antipatterns

### Don't Enable Updates Globally 

in `ApplicationRecord` (or similar base classes). This will trigger an Action Cable broadcast to all users, giving Redis and your app server a hard time.

Rather, choose to opt in to enable updates on a granular level, model by model.

### Don't Wrap Large DOM Trees

A common mistake is to wrap a large portion of your view in an `updates_for` tag. This can lead to morph, and focus restoration issues. Prefer wrapping smaller portions of the DOM containing the actually volatile parts.

For example, instead of wrapping a whole `_post.html.erb` partial, you could only wrap the updated date and the body:

```erb
<!-- BAD ❌ -->
<%= updates_for @post do %>
  <%= @post.updated_at %>
  
  <%= simple_format @post.body %>
<% end %>

<!-- GOOD 🙌 -->
<%= updates_for @post, only: :updated_at do %>
  <%= @post.updated_at %>
<% end %>
  
<%= updates_for @post, only: :body do %>
  <%= simple_format @post.body %>
<% end %>  
```

## Debugging

`CableReady::Updatable` comes with handy diagnostic console outputs that you can enable when initializing the client side module:

```js
import CableReady from 'cable_ready'

const consumer = // get ActionCableConsumer

CableReady.initialize({ consumer, debug: true })
```
