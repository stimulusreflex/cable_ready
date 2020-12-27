# Browser Manipulations

## clear\_storage

Removes all key/values pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page.

```ruby
cable_ready["MyChannel"].clear_storage(
  type: "session" # local storage vs session storage, defaults to local
)
```

#### Life-cycle Callback Events

* `cable-ready:before-clear-storage`
* `cable-ready:after-clear-storage`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

## push\_state

Add an entry to the browser's session history stack.

This is similar to setting `window.location = "#foo"` in that both will also create and activate another history entry associated with the current document. The new URL can be any URL in the same origin as the current URL.

You can associate arbitrary data with your new history entry by passing a Hash to the optional `state` parameter.

```ruby
cable_ready["MyChannel"].push_state(
  url: "/",      # required - URL String
  title: "Home", # optional String, default to ""
  state: {}      # optional Hash, defaults to {}
)
```

{% hint style="warning" %}
 Note that `push_state` never causes a [`hashchange`](https://developer.mozilla.org/en-US/docs/Web/Events/hashchange) event to be fired, even if the new URL differs from the old URL only in its hash.
{% endhint %}

#### Life-cycle Callback Events

* `cable-ready:before-push-state`
* `cable-ready:after-push-state`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/History/pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)

## remove\_storage\_item

Remove a key/value pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page. Integer keys are automatically converted to strings.

```ruby
cable_ready["MyChannel"].remove_storage_item(
  key: "string", # required
  type: "session" # local storage vs session storage, defaults to local
)
```

#### Life-cycle Callback Events

* `cable-ready:before-remove-storage-item`
* `cable-ready:after-remove-storage-item`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

## set\_cookie

Writes a cookie to the document cookie store.

```ruby
cable_ready["MyChannel"].set_cookie(
  cookie: "string" # required - "example=value; path=/; expires=Sat, 07 Mar 2020 16:19:19 GMT"
)
```

{% hint style="info" %}
Note that you can only set/update a single cookie at a time using this method.
{% endhint %}

#### Life-cycle Callback Events

* `cable-ready:before-set-cookie`
* `cable-ready:after-set-cookie`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)

## set\_focus

Set focus on the specified element, if it can be focused. The focused element is the element which will receive keyboard and similar events by default.

```ruby
cable_ready["MyChannel"].set_focus(
  selector: "string" # required - string containing a CSS selector or XPath expression
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-focus`
* `cable-ready:after-set-focus`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus)

## set\_storage\_item

Create or update a key/value pair on the local persistant storage of the user's browser. Defaults to local storage, which is saved across browser sessions. Specify `type: 'session'` if session storage is desired.

Data stored in either local or session storage is specific to the protocol of the page. Integer keys are automatically converted to strings.

```ruby
cable_ready["MyChannel"].set_storage_item(
  key: "string", # required
  value: "string", # required
  type: "session" # local storage vs session storage, defaults to local
)
```

#### Life-cycle Callback Events

* `cable-ready:before-set-storage-item`
* `cable-ready:after-set-storage-item`

#### Reference

* [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

