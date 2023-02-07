# Browser Manipulations

## `clear_storage`

Removes all key/values pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page.

```ruby
clear_storage(
  batch:  String,  # [null]    - add the operation to a named batch
  cancel: Boolean, # [false]   - cancel the operation (for use on client)
  delay:  Integer, # [0]       - wait for n milliseconds before running
  type:   String   # ["local"] - "session" or "local"
)
```

#### Life-cycle Callback Events

* `cable-ready:before-clear-storage`
* `cable-ready:after-clear-storage`

Life-cycle events for `clear_storage` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

## `go`

Load a specific page from the session history. You can use it to move forwards and backwards through the history depending on the value of a parameter.

`delta` is the position in the history to which you want to move, relative to the current page. A negative value moves backwards, a positive value moves forwards. `delta: -1` is equivalent to pressing the browsers "Back" button.

If no value is passed or if `delta` equals `0`, it has the same result as calling `location.reload()`.

```ruby
go(
  batch:  String,  # [null]  - add the operation to a named batch
  cancel: Boolean, # [false] - cancel the operation (for use on client)
  delay:  Integer, # [0]     - wait for n milliseconds before running
  delta:  Integer  #         - optional positive or negative integer
)
```

#### Life-cycle Callback Events

* `cable-ready:before-go`
* `cable-ready:after-go`

Life-cycle events for `go` are raised on `window`. Add a listener for the [`popstate`](https://developer.mozilla.org/en-US/docs/Web/Events/popstate) event in order to determine when the navigation has completed.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/History/go](https://developer.mozilla.org/en-US/docs/Web/API/History/go)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)

## `push_state`

Add an entry to the browser's session history stack.

This is similar to setting `window.location = "#foo"` in that both will also create and activate another history entry associated with the current document. The new URL can be any URL in the same origin as the current URL.

You can associate arbitrary data with your new history entry by passing a Hash to the optional `state` parameter.

```ruby
push_state(
  batch:  String,  # [null]   - add the operation to a named batch
  cancel: Boolean, # [false]  - cancel the operation (for use on client)
  delay:  Integer, # [0]      - wait for n milliseconds before running
  url:    String,  # required - URL String
  title:  String,  # [""]     - optional String
  state:  Object   # [{}]     - optional Hash
)
```

::: warning
 Note that `push_state` never causes a [`hashchange`](https://developer.mozilla.org/en-US/docs/Web/Events/hashchange) event to be fired, even if the new URL differs from the old URL only in its hash.
:::

#### Life-cycle Callback Events

* `cable-ready:before-push-state`
* `cable-ready:after-push-state`

Life-cycle events for `push_state` are raised on `window`. Add a listener for the [`popstate`](https://developer.mozilla.org/en-US/docs/Web/Events/popstate) event in order to determine when the navigation has completed.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/History/pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)

## `redirect_to`

Initiate navigation to a new URL. Techniques will be used in the following order:

1. Turbo.visit
2. Turbolinks.visit
3. window.location.href

`Turbo.visit` will be used if the target location is on the same domain and the Turbo library is available as `window.Turbo`.

`Turbolinks.visit` will be used if the target location is on the same domain and the Turbolinks library is available as `window.Turbolinks`.

There is an `action` option which can only be "advance" \(default value, which is comparable to `push_state`\) or `replace` \(which is similar to `replace_state`\).

```ruby
redirect_to(
  action: String,  # "advance" - other possible value is "replace"
  batch:  String,  # [null]    - add the operation to a named batch
  cancel: Boolean, # [false]   - cancel the operation (for use on client)
  delay:  Integer, # [0]       - wait for n milliseconds before running
  url:    String   # required  - URL String
)
```

::: warning
Note that, if your redirect is handled by `window.location.href`, there can be no reliable opportunity to emit or capture an `after-redirect-to` event.
:::

#### Life-cycle Callback Events

* `cable-ready:before-redirect-to`
* `cable-ready:after-redirect-to`

Life-cycle events for `redirect_to` are raised on `window`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location)
* [https://github.com/turbolinks/turbolinks\#turbolinksvisit](https://github.com/turbolinks/turbolinks#turbolinksvisit)
* [https://turbo.hotwired.dev/reference/drive\#turbodrivevisit](https://turbo.hotwired.dev/reference/drive#turbodrivevisit)

## `reload`

This will force a hard refresh of the current page at the moment the operation is executed. It is the programmatic equivalent of hitting the browser's Refresh button.

While there's not much to say about `reload` - it is a method that has no parameters, after all - it can be useful to request a page refresh. Not only will the DOM be restored to a pristine state, but all Stimulus controllers will have an opportunity to reinitialize. The `delay` option might be a useful pairing in tricky timing circumstances.

The Turbolinks and Turbo Drive cache will be cleared during the reload.

```ruby
reload(
  batch:  String,  # [null]    - add the operation to a named batch
  cancel: Boolean, # [false]   - cancel the operation (for use on client)
  delay:  Integer  # [0]       - wait for n milliseconds before running
)
```

::: warning
There can be no reliable opportunity to emit or capture an `after-reload` event unless the operation is flagged `cancel`.
:::

#### Life-cycle Callback Events

* `cable-ready:before-reload`
* `cable-ready:after-reload`

Life-cycle events for `reload` are raised on `window`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Location/reload](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)

## `remove_storage_item`

Remove a key/value pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page. Integer keys are automatically converted to strings.

```ruby
remove_storage_item(
  batch:  String,  # [null]    - add the operation to a named batch
  cancel: Boolean, # [false]   - cancel the operation (for use on client)
  delay:  Integer, # [0]       - wait for n milliseconds before running
  key:    String,  # required
  type:   String   # ["local"] - "local" or "session"
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-storage-item`
* `cable-ready:after-remove-storage-item`

Life-cycle events for `remove_storage_item` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

## `replace_state`

Modify the current browser history entry. The browser will not load the page specified by the `url` and indeed, it doesn't actually have to exist.

You can associate arbitrary data with the history entry by passing a Hash to the optional `state` parameter.

::: info
Most of the time, you probably want to use `push_state`.
:::

```ruby
replace_state(
  batch:  String,  # [null]   - add the operation to a named batch
  cancel: Boolean, # [false]  - cancel the operation (for use on client)
  delay:  Integer, # [0]      - wait for n milliseconds before running
  url:    String,  # required - URL String
  title:  String,  # [""]     - optional String
  state:  Object   # [{}]     - optional Hash
)
```

#### Life-cycle Callback Events

* `cable-ready:before-replace-state`
* `cable-ready:after-replace-state`

Life-cycle events for `replace_state` are raised on `window`. Add a listener for the [`popstate`](https://developer.mozilla.org/en-US/docs/Web/Events/popstate) event in order to determine when the navigation has completed.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)

## `scroll_into_view`

Scroll the viewport so that the element with the specified anchor \(`id` attribute\) is in view.

```ruby
scroll_into_view(
  batch:    String,  # [null]      - add the operation to a named batch
  behavior: String,  # ["auto"]    - auto or smooth
  block:    String,  # ["start"]   - start, center, end, nearest
  cancel:   Boolean, # [false]     - cancel the operation (for use on client)
  delay:    Integer, # [0]         - wait for n milliseconds before running
  inline:   String,  # ["nearest"] - start, center, end, nearest
  selector: String,  # required    - string containing a CSS selector or XPath expression
  xpath:    Boolean  # [false]     - process the selector as an XPath expression
)
```

#### Example

```html
<div id="i-am-an-anchor">⚓</div>
```

The default behavior is to instantly jump to the element such that the top of the element is touching the top of the browser viewport.

::: tip
If you're looking for a more _human_ experience, give `behavior: "smooth", block: "center"` a try.
:::

#### Life-cycle Callback Events

* `cable-ready:before-scroll-into-view`
* `cable-ready:after-scroll-into-view`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

## `set_cookie`

Writes a cookie to the document cookie store.

```ruby
set_cookie(
  batch:  String,  # [null]   - add the operation to a named batch
  cancel: Boolean, # [false]  - cancel the operation (for use on client)
  cookie: String,  # required - "example=value; path=/; expires=Sat, 07 Mar 2020 16:19:19 GMT"
  delay:  Integer  # [0]      - wait for n milliseconds before running
)
```

::: info
Note that you can only set/update a single cookie at a time using this method.
:::

#### Life-cycle Callback Events

* `cable-ready:before-set-cookie`
* `cable-ready:after-set-cookie`

Life-cycle events for `set_cookie` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)

## `set_focus`

Set focus on the specified element, if it can be focused. The focused element is the element which will receive keyboard and similar events by default.

```ruby
set_focus(
  batch:    String,  # [null]   - add the operation to a named batch
  cancel:   Boolean, # [false]  - cancel the operation (for use on client)
  delay:    Integer, # [0]      - wait for n milliseconds before running
  selector: String,  # required - string containing a CSS selector or XPath expression
  xpath:    Boolean  # [false]  - process the selector as an XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-focus`
* `cable-ready:after-set-focus`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus)

## `set_storage_item`

Create or update a key/value pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page. Integer keys are automatically converted to strings.

```ruby
set_storage_item(
  batch:  String,  # [null]    - add the operation to a named batch
  cancel: Boolean, # [false]   - cancel the operation (for use on client)
  delay:  Integer, # [0]       - wait for n milliseconds before running
  key:    String,  # required
  value:  String,  # required
  type:   String   # ["local"] - "local" or "session"
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-storage-item`
* `cable-ready:after-set-storage-item`

Life-cycle events for `set_storage_item` are raised on `document`.

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
