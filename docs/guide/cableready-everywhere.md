# CableReady Everywhere

## Get comfortable with rendering HTML in new places

One thing you'll find yourself doing when working with CableReady is rendering HTML in places you might not previously have done so.

It's possible to use Rails for a while before you realize that the `render` method might be useful for more than just partials. Perhaps you need to render some JSON or a text string in your controller, but sooner or later you become aware that Rails is calling `render` _for you_ at the end of most Rails controller actions.

You can call `render` from almost anywhere, using `ApplicationController.render`... which just is long enough to get annoying if you type it a lot.

Experience has taught us that shorter calls lead to code that is easier to read and reason about, so we often **delegate** the `render` method to `ApplicationController` so that we don't have to type "ApplicationController" over and over.

In the sections below, you'll learn how to configure `ApplicationController`, `ApplicationRecord` and `ApplicationJob` so that they make working with CableReady a breeze.

## Controller Actions

#### ... and API endpoints, web hooks, OAuth callbacks, etc.

First, we recommend that you include CableReady in your `ApplicationController`:

::: code-group
```ruby [app/controllers/application_controller.rb]
class ApplicationController < ActionController::Base
  include CableReady::Broadcaster
end
```
:::

Controller actions that handle Ajax requests, as well as web hooks and OAuth endpoints are great places to call CableReady. It's also common to broadcast CableReady operations to groups of users and/or resources inside controller actions.

If you perform a CableReady broadcast during a standard page controller action, it will send the broadcast immediately; before the action has completed, before the view template has been rendered and before the HTML has been sent to the client. This can lead to developers becoming convinced (incorrectly) that the broadcast did not work. See [this advice on Rails remote forms](/troubleshooting/#remote-forms-in-rails-6-1) in the Troubleshooting chapter as well.

If you need the user executing the controller action to see the broadcast, you should [use an ActiveJob](https://app.gitbook.com/@stimulusreflex/s/cableready/\~/drafts/-MPd3ezNjm713wu61\_WO/usage#triggering-cableready-from-a-job) that has been delayed for a few seconds using the [set](https://edgeguides.rubyonrails.org/active_job_basics.html#enqueue-the-job) method. There's also [a good example](/guide/leveraging-stimulus.md#example-3-the-logical-splitter) of using Stimulus to provide an elegant solution to group update issues.

### Ajax

Fans of [Turbo Streams](https://turbo.hotwired.dev/handbook/streams) will be excited to know that it is easy to use CableReady with standard Rails controller actions. Here's how to do it:

```html
<%= link_to "Console message", "users/#{current_user.id}/message", method: :patch %>
```

::: code-group
```ruby [config/routes.rb]
patch 'users/:id/message', to: 'users#message', constraints: lambda { |request| request.xhr? }
```

```ruby [app/controllers/users_controller.rb]
class UsersController < ApplicationController
  def message
    cable_ready[UsersChannel].console_log(message: "Hi!").broadcast_to(current_user)
    head :ok
  end
end
```
:::

Not too shabby, right?

### Cable Car

While Cable Car is covered fully in [its own chapter](/guide/cable-car.md), it's really easy to return a payload that can be parsed as JSON and passed directly to `CableReady.perform()` on the client.

::: code-group

```javascript [JavaScript]
fetch('users/42/message', {method: 'PATCH'})
  .then(response => response.json())
  .then(data => CableReady.perform(data))
```

```ruby [config/routes.rb]
patch 'users/:id/message', to: 'users#message'
```

```ruby [app/controllers/users_controller.rb]
class UsersController < ApplicationController
  def message
    render operations: cable_car.console_log(message: "Hi!")
  end
end
```
:::

## Jobs

Using ActiveJob - especially when it's backed by the awesome [Sidekiq](https://sidekiq.org) - is arguably one of the two best and most common ways developers broadcast CableReady operations, along with [Reflexes](https://docs.stimulusreflex.com/reflexes#using-cableready-inside-a-reflex-action).

Make sure that `CableReady::Broadcaster` is included in your `ApplicationJob`, and delegate `render` to `ApplicationController`:

::: code-group
```ruby [app/jobs/application_job.rb]
class ApplicationJob < ActiveJob::Base
  include CableReady::Broadcaster
  delegate :render, to: :ApplicationController
end
```
:::

Here's a _genuinely_ contrived example of using a Job to drive CableReady:

::: code-group
```html [app/views/home/index.html.erb]
What could possibly happen?<br>
<div id="content"></div>
```

```ruby [app/controllers/home_controller.rb]
class HomeController < ApplicationController
  def index
    ExampleJob.set(wait: 5.seconds).perform_later current_user.id
  end
end
```
:::

If anyone starts lecturing you about the urgent and unquestionable need for the separation of business logic from presentation, [tell them that you have work to do](/troubleshooting/#dont-perform-purity-rituals).

::: code-group
```ruby [app/jobs/example_job.rb]
class ExampleJob < ApplicationJob
  include CableReady::Broadcaster
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    cable_ready[UsersChannel].inner_html(
      selector: "#content",
      html: "Hello World this is the background job."
    ).broadcast_to(user)
  end
end
```
:::

## mrujs

TODO

## AllFutures

TODO

## Rails console

TODO

## Rails runner

TODO

## ActiveRecord

Make sure that `CableReady::Broadcaster` is included in your `ApplicationRecord`, and delegate `render` to `ApplicationController`:

::: code-group
```ruby [app/models/application_record.rb]
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  include CableReady::Broadcaster
  delegate :render, to: :ApplicationController

  def sgid
    to_sgid(expires_in: nil).to_s
  end
end
```
:::

We also recommend that you add a `sgid` method to your models, to make it easier to work with [Secure Global IDs when handling broadcasting to resources](/guide/broadcasting-to-resources.md#using-signed-global-id-for-lookups). By default, Rails uses the current time to set sgids to expire after a month by default. This means that every time you'd run `to_sgid`, you would get a different result, which is not useful for our purposes - we need repeatable values.

### Callbacks

Some people love them, and some people hate them. Regardless of your feelings about model callbacks, it's hard to ignore how CableReady dances inside of an ActiveRecord callback:

```ruby
class Post < ApplicationRecord
  after_update do
    cable_ready[PostsChannel].morph(
      selector: dom_id(self),
      html: render(self)
    ).broadcast_to(self)
  end
end
```

If things aren't quite so straight-forward with your partial rendering, you can still do this:

```ruby
class Post < ApplicationRecord
  after_update do
    cable_ready[PostsChannel].morph(
      selector: dom_id(self),
      html: render(partial: "navbar/posts", locals: { post: self })
    ).broadcast_to(self)
  end
end
```

If the location of your partial needs to be dynamic based on the context, you can re-assign it:

```ruby
class Post < ApplicationRecord
  after_update do
    cable_ready[PostsChannel].morph(
      selector: dom_id(self),
      html: render(self)
    ).broadcast_to(self)
  end

  def to_partial_path
    "navbar/posts"
  end
end
```

All excitement aside, we'd still recommend using those callbacks to queue up ActiveJobs instead of calling CableReady directly. But hey... the more you know, right?

### State machines

Another promising use of CableReady inside of your models is [state machine](https://github.com/state-machines/state_machines) transition callbacks:

::: code-group
```ruby [app/models/post.rb]
  state_machine initial: :pending do
    event :accept do
      transition [:pending] => :active
    end
    after_transition on: :accept do |post|
      cable_ready[PostsChannel].morph(
        selector: dom_id(post),
        html: render(post)
      ).broadcast_to(post)
    end
  end
```
:::

## ActionCable

Make sure that `CableReady::Broadcaster` is included in your `ApplicationCable`, and delegate `render` to `ApplicationController`:

::: code-group
```ruby [app/channels/application_cable/channel.rb]
module ApplicationCable
  class Channel < ActionCable::Channel::Base
    include CableReady::Broadcaster
    delegate :render, to: :ApplicationController
  end
end
```
:::

In a new twist, let's empower this channel to receive data from the clients:

::: code-group
```ruby [app/channels/sailors_channel.rb]
class SailorsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sailors"
  end

  def receive(data)
    cable_ready["sailors"].console_log(message: "A sailor yells: #{data}").broadcast
  end
end

```
:::

This controller can send text back up to the server when the `greet` method is fired:

::: code-group
```javascript [app/javascript/controllers/sailors_controller.js]
import { Controller } from '@hotwired/stimulus'
import CableReady from 'cable_ready'

export default class extends Controller {
  connect () {
    this.channel = this.application.consumer.subscriptions.create('SailorsChannel', {
      received (data) {
        if (data.cableReady) CableReady.perform(data.operations)
      }
    })
  }

  greet (event) {
    this.channel.send(event.target.value)
  }

  disconnect () {
    this.channel.unsubscribe()
  }
}
```
:::

Finally, let's wire up the input element's change event to the `greet` method:

::: code-group
```html [index.html.erb]
<input type="text" data-controller="sailors" data-action="change->sailors#greet">
```
:::

## ActionMailbox

TODO

## StimulusReflex

StimulusReflex users must **not** include `CableReady::Broadcaster` in their Reflex classes, as it makes special versions of the CableReady methods available.

If you would like to read more about using StimulusReflex with CableReady, please consult "[Using CableReady inside a Reflex action](https://docs.stimulusreflex.com/guide/cableready.html#using-cableready-inside-a-reflex-action)".
