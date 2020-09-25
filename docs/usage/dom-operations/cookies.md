# Cookies

## [setCookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)

{% hint style="info" %}
Writes a cookie to the cookie store.
{% endhint %}

```ruby
cable_ready["MyChannel"].set_cookie(
  cookie: "string" # "example=value; path=/; expires=Sat, 07 Mar 2020 16:19:19 GMT"
)
```

