# Installation

{% hint style="success" %}
If you're running [StimulusReflex](https://docs.stimulusreflex.com) or other CableReady-powered libraries \(such as [Optimism](https://optimism.leastbad.com/) or [Futurism](https://github.com/julianrubisch/futurism)\), CableReady is already installed as a dependency and you can move on to [Setup](setup.md#setup). 🎉
{% endhint %}

CableReady has both client \([npm package](https://www.npmjs.com/package/cable_ready)\) and server \([Ruby gem](https://rubygems.org/gems/cable_ready)\) components which need to be installed. It is vitally important that you **make sure that your server and client versions match exactly**.

{% hint style="danger" %}
There can be issues with conflicting versions introduced when we're testing a pre-release build, since yarn will typically install the most recent package available, while Rubygems will install the last official release. 🤯
{% endhint %}

```bash
bundle add cable_ready
yarn add cable_ready
```

You can manually tweak and/or lock the versions you want to install by modifying `Gemfile` and `package.json` respectively, then re-running `bundle install && yarn install`.

## Upgrading, package versions and sanity

In the future, should you ever upgrade your version of CableReadh, it's very important that you always make sure your gem version and npm package versions match.

Since mismatched versions are the first step on the path to hell, by default CableReady won't allow the server to start if your versions are mismatched in the development environment.

If you have special needs, you can override this setting in your initializer. `:warn` will emit the same text-based warning but not prevent the server process from starting. `:ignore` will silence all mismatched version warnings, if you really just DGAF. ¯\\_\(ツ\)\_/¯

CableReady can also let you know when new stable versions are released during the application start-up process. This opt-in behaviour is `:ignore` by default, but you can set it to `:warn` or `:exit`.

{% code title="config/initializers/cable\_ready.rb" %}
```ruby
CableReady.configure do |config|
  config.on_failed_sanity_checks = :warn
  config.on_new_version_available = :warn
end
```
{% endcode %}

### Upgrading to v5.0.0

* git repos are now living in the [stimulusreflex](https://github.com/stimulusreflex) organization on GitHub
* make sure that you update `cable_ready` to `5.0.0` in **both** your Gemfile and package.json
* create an initializer with `rails g cable_ready:initializer` if needed
* install `stream_from` support with `rails g cable_ready:stream_from`
* install the `@cable_ready/audio_operations` npm package if required
* convert your custom operations to use the new `CableReady.operations` object

## ActionCable

CableReady depends on the [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html) framework \(installed by default as part of [Ruby on Rails](https://rubyonrails.org/)\) to handle sending data to the client over websockets. You must have ActionCable installed on both the client and server... and it will be unless you've disabled it.

You can check your `package.json` to verify that `@rails/actioncable` is installed. If you have trouble with ActionCable, consider [verifying that it's installed correctly](troubleshooting/#verify-actioncable).

## Redis

[Redis](https://redis.io/download) for everything: caching, sessions, jobs and yes, ActionCable. Redis is a dependency for StimulusReflex; the installation task sets up Redis for ActionCable's [subscription adapter](https://guides.rubyonrails.org/action_cable_overview.html#subscription-adapter) in the development environment.

While Redis in development is not mandatory for standalone CableReady use, we do recommend it:

{% code title="Gemfile" %}
```ruby
gem "redis", ">= 4.0", :require => ["redis", "redis/connection/hiredis"]
gem "hiredis"
```
{% endcode %}

{% code title="config/cable.yml" %}
```yaml
development:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: your_application_development
```
{% endcode %}

## Rails 5.2

The CableReady documentation assumes that you are running Rails 6.x. It is possible to use CableReady with Rails 5.2, but you must make some adjustments to your configuration.

1. Replace `actioncable` with `@rails/actioncable` in `package.json`
   * `yarn remove actioncable`
   * `yarn add @rails/actioncable`
2. Replace any instance of `import Actioncable from "actioncable"` with `import { createConsumer } from "@rails/actioncable"`
   * This imports the `createConsumer` function directly
   * Previously, you might call `createConsumer()` on the `Actioncable` import: `Actioncable.createConsumer()`
   * Now, you can reference `createConsumer()` directly

## Polyfills for IE11

If you need to provide support for older browsers, you can `yarn add @cable_ready/polyfills` and include them **before** your Stimulus controllers \(if any\) and CableReady channels:

{% code title="app/javascript/packs/application.js" %}
```javascript
// other stuff
import '@cable_ready/polyfills'
import 'channels'
import 'controllers'
```
{% endcode %}

