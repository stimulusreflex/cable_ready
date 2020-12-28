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

{% code title="app/controllers/application\_controller.rb" %}
```ruby
class ApplicationController < ActionController::Base
  include CableReady::Broadcaster
end
```
{% endcode %}

Controller actions that handle Ajax requests, as well as web hooks and OAuth endpoints are great places to call CableReady. It's also common to broadcast CableReady operations to groups of users and/or resources inside controller actions.

If you perform a CableReady broadcast during a standard page controller action, it will send the broadcast immediately; before the action has completed, before the view template has been rendered and before the HTML has been sent to the client. This can lead to developers becoming convinced \(incorrectly\) that the broadcast did not work.

If you need the user executing the controller action to see the broadcast, you should [use an ActiveJob](https://app.gitbook.com/@stimulusreflex/s/cableready/~/drafts/-MPd3ezNjm713wu61_WO/usage#triggering-cableready-from-a-job) that has been delayed for a few seconds using the [set](https://edgeguides.rubyonrails.org/active_job_basics.html#enqueue-the-job) method. There's also [a good example](leveraging-stimulus.md#example-3-the-logical-splitter) of using Stimulus to provide an elegant solution to group update issues.

### Ajax

Fans of [Hotwire Turbo Streams](https://turbo.hotwire.dev/handbook/streams) will be excited to know that it is easy to use CableReady with standard Rails controller actions. Here's how to do it:

```markup
<%= link_to "Console message", "users/#{current_user.id}/message", method: :patch %>
```

{% code title="config/routes.rb" %}
```ruby
patch 'users/:id/message', to: 'users#message', constraints: lambda { |request| request.xhr? }
```
{% endcode %}

{% code title="app/controllers/users\_controller.rb" %}
```ruby
class UsersController < ApplicationController
  def message
    cable_ready[UsersChannel].console_log(message: "Hi!").broadcast_to(current_user)
    head :ok
  end
end
```
{% endcode %}

Not too shabby, right?

## Jobs

Using ActiveJob - especially when it's backed by the awesome [Sidekiq](https://sidekiq.org/) - is arguably one of the two best and most common ways developers broadcast CableReady operations, along with [Reflexes](https://docs.stimulusreflex.com/reflexes#using-cableready-inside-a-reflex-action).

Make sure that `CableReady::Broadcaster` is included in your `ApplicationJob`, and delegate `render` to `ApplicationController`:

{% code title="app/jobs/application\_job.rb" %}
```ruby
class ApplicationJob < ActiveJob::Base
  include CableReady::Broadcaster
  delegate :render, to: :ApplicationController
end
```
{% endcode %}

Here's a _genuinely_ contrived example of using a Job to drive CableReady:

{% code title="app/views/home/index.html.erb" %}
```markup
What could possibly happen?<br>
<div id="content"></div>
```
{% endcode %}

{% code title="app/controllers/home\_controller.rb" %}
```ruby
class HomeController < ApplicationController
  def index
    ExampleJob.set(wait: 5.seconds).perform_later current_user.id
  end
end
```
{% endcode %}

If anyone starts lecturing you about the urgent and unquestionable need for the separation of business logic from presentation, [tell them that you have work to do](troubleshooting/#dont-perform-purity-rituals).

{% code title="app/jobs/example\_job.rb" %}
```ruby
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
{% endcode %}

## ActiveRecord

Make sure that `CableReady::Broadcaster` is included in your `ApplicationRecord`, and delegate `render` to `ApplicationController`:

{% code title="app/models/application\_record.rb" %}
```ruby
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  include CableReady::Broadcaster
  delegate :render, to: :ApplicationController
  
  def sgid
    to_sgid(expires_in: nil).to_s
  end
end
```
{% endcode %}

We also recommend that you add a `sgid` method to your models, to make it easier to work with [Secure Global IDs when handling broadcasting to resources](broadcasting-to-resources.md#using-signed-global-id-for-lookups). By default, Rails uses the current time to set sgids to expire after a month by default. This means that every time you'd run `to_sgid`, you would get a different result, which is not useful for our purposes - we need repeatable values.

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

{% code title="app/models/post.rb" %}
```ruby
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
{% endcode %}

## ActionCable

Make sure that `CableReady::Broadcaster` is included in your `ApplicationCable`, and delegate `render` to `ApplicationController`:

{% code title="app/channels/application\_cable/channel.rb" %}
```ruby
module ApplicationCable
  class Channel < ActionCable::Channel::Base
    include CableReady::Broadcaster
    delegate :render, to: :ApplicationController
  end
end
```
{% endcode %}

In a new twist, let's empower this channel to receive data from the clients:

{% code title="app/channels/sailors\_channel.rb" %}
```ruby
class SailorsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sailors"
  end

  def receive(data)
    cable_ready["sailors"].console_log(message: "A sailor yells: #{data}").broadcast
  end
end

```
{% endcode %}

This controller can send text back up to the server when the `greet` method is fired:

{% code title="app/javascript/controllers/sailors\_controller.js" %}
```javascript
import { Controller } from 'stimulus'
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
{% endcode %}

Finally, let's wire up the input element's change event to the `greet` method:

{% code title="index.html.erb" %}
```markup
<input type="text" data-controller="sailors" data-action="change->sailors#greet">
```
{% endcode %}

## StimulusReflex

StimulusReflex users must **not** include `CableReady::Broadcaster` in their Reflex classes, as it makes special versions of the CableReady methods available.

If you would like to read more about using StimulusReflex with CableReady, please consult "[Using CableReady inside a Reflex action](https://docs.stimulusreflex.com/reflexes#using-cableready-inside-a-reflex-action)".

