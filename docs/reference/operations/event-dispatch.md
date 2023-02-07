# DOM Events

## `dispatch_event`

Create a custom DOM event in the browser for the purpose of implementing custom functionality.

`dispatch_event` immediately dispatches a DOM CustomEvent in the browser. These events bubble up through the DOM and are cancelable.

If jQuery is in use (and available in the global `window` scope) `dispatch_event` will also [trigger a jQuery event](https://api.jquery.com/trigger/) with the same name.

```ruby
dispatch_event(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]    - cancel the operation (for use on client)
  delay:      Integer, # [0]        - wait for n milliseconds before running
  detail:     Object,  # [null]     - assigned to event.detail
  name:       String,  # required   - the name of the DOM event to dispatch (can be custom)
  select_all: Boolean, # [false]    - operate on list of elements returned from selector
  selector:   String,  # [document] - string containing a CSS selector or XPath expression
  xpath:      Boolean  # [false]    - process the selector as an XPath expression
)
```

While the event itself is frequently the payload, you can build very powerful functionality by passing a Hash of metadata to the `detail` parameter.

::: info
The `detail` parameter will convert `user_id` to `userId` - snake_case to camelCase - for JS consumption on the client.
:::

Developers frequently use `dispatch_event` to notify the client when long-running server  processes are completed. You can see an example in [Leveraging Stimulus](/guide/leveraging-stimulus.md#event-listener-controllers).

#### Life-cycle Callback Events

* `cable-ready:before-dispatch-event`
* `cable-ready:after-dispatch-event`

Life-cycle events for `dispatch_event` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
* [https://github.com/caroso1222/notyf](https://github.com/caroso1222/notyf)
* [Dispatched event listener controllers](/guide/leveraging-stimulus.md#event-listener-controllers)

## `set_meta`

Add a `meta` tag to your document `head`. If a `meta` tag with the same name already exists, update the `content` to a new value.

```ruby
set_meta(
  batch:      String,  # [null]   - add the operation to a named batch
  cancel:     Boolean, # [false]  - cancel the operation (for use on client)
  content:    String,  # required - the content attribute of the meta tag
  delay:      Integer, # [0]      - wait for n milliseconds before running
  name:       String   # required - the name attribute of the meta tag
)
```

`meta` tags are under-appreciated as a semantically-appropriate place to place data that can be consumed by multiple components on a page. It's even less common to see scenarios where a `meta` tag is updated after the page has been rendered. This is a shame, because there's absolutely no good reason not to do so.

#### Example

Here is a Stimulus controller that watches a `meta` tag for `content` changes, which update the attached element. In this example, imagine a notification "pill" component that is not displayed if there is no text value.

```javascript
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = { tag: String }

  initialize () {
    this.metaTag = document.head.querySelector(
      `meta[name=pill-${this.tagValue}]`
    )
    this.element.textContent = this.metaTag.content
    this.observer = new MutationObserver(this.meta)
  }

  connect () {
    this.observer.observe(this.metaTag, {
      attributeFilter: ['content']
    })
  }

  disconnect () {
    this.observer.disconnect()
  }

  meta = mutation => {
    this.element.textContent = mutation[0].target.content || ''
  }
}
```

```html
<head>
  <meta name="pill-messages" content="4" />
</head>

<span class="badge text-danger" data-controller="pill" data-pill-tag-value="messages"></span>
```

This technique allows the developer to update data that concerns the page without a potentially brittle expectation that the server knows the `id` of every component that needs to be updated.

#### Life-cycle Callback Events

* `cable-ready:before-set-meta`
* `cable-ready:after-set-meta`

Life-cycle events for `set_meta` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
