<p align="center">
  <img src="https://raw.githubusercontent.com/stimulusreflex/cable_ready/main/assets/cable-ready-logo-with-copy.svg" width="360" />
  <h1 align="center">Welcome to CableReady 👋</h1>
  <p align="center">
    <a href="https://rubygems.org/gems/cable_ready">
      <img src="https://img.shields.io/gem/v/cable_ready.svg?color=red" />
    </a>
    <a href="https://www.npmjs.com/package/cable_ready">
      <img src="https://img.shields.io/npm/v/cable_ready.svg?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/cable_ready">
      <img alt="downloads" src="https://img.shields.io/npm/dm/cable_ready.svg?color=blue" target="_blank" />
    </a>
    <a href="https://github.com/stimulusreflex/cable_ready/blob/main/LICENSE">
      <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-brightgreen.svg" target="_blank" />
    </a>
    <a href="https://cableready.stimulusreflex.com" target="_blank">
      <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
    </a>
    <br />
    <a href="#badge">
      <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
    </a>
    <a href="https://github.com/testdouble/standard" target="_blank">
      <img alt="Ruby Code Style" src="https://img.shields.io/badge/Ruby_Code_Style-standard-brightgreen.svg" />
    </a>
    <a href="https://github.com/sheerun/prettier-standard" target="_blank">
      <img alt="JavaScript Code Style" src="https://img.shields.io/badge/JavaScript_Code_Style-prettier_standard-ff69b4.svg" />
    </a>
    <br />
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/stimulusreflex/cable_ready/actions/workflows/prettier-standard.yml">
      <img src="https://github.com/stimulusreflex/cable_ready/workflows/Prettier-Standard/badge.svg" alt="Prettier-Standard" style="max-width:100%;">
    </a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/stimulusreflex/cable_ready/actions/workflows/standardrb.yml">
      <img src="https://github.com/stimulusreflex/cable_ready/workflows/StandardRB/badge.svg" alt="StandardRB" style="max-width:100%;">
    </a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/stimulusreflex/cable_ready/actions/workflows/tests.yml">
      <img src="https://github.com/stimulusreflex/cable_ready/workflows/Tests/badge.svg" alt="Tests" style="max-width:100%;">
    </a>
  </p>
</p>
<br />

CableReady helps you create great real-time user experiences by making it simple to trigger client-side DOM changes from server-side Ruby. It establishes a standard for interacting with the client via ActionCable web sockets. No need for custom JavaScript.

Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html)
to learn more about ActionCable before proceeding.

## 📚 Docs

- [Official Documentation](https://cableready.stimulusreflex.com)
- [Documentation Source Code](https://github.com/stimulusreflex/cable_ready/tree/main/docs)

## 💙 Community

- [Discord](https://discord.gg/stimulus-reflex) - primary support channel

## 🚀 Install

### Rubygem

```sh
bundle add cable_ready
```

### JavaScript

There are a few ways to install the CableReady JavaScript client, depending on your application setup.

#### ESBuild / Webpacker

```sh
yarn add cable_ready
```

#### Import maps:

```ruby
# config/importmap.rb

# ...

pin 'cable_ready', to: 'cable_ready.js', preload: true
```

#### Rails Asset pipeline (Sprockets):

```html+erb
<!-- app/views/layouts/application.html.erb -->

<%= javascript_include_tag "cable_ready.umd.js", "data-turbo-track": "reload" %>
```

Checkout the [documentation](https://cableready.stimulusreflex.com) to continue!

## 🙏 Contributing

### Code of Conduct

Everyone interacting with CableReady is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md)

### Coding Standards

This project uses [Standard](https://github.com/testdouble/standard)
and [prettier-standard](https://github.com/sheerun/prettier-standard) to minimize bike shedding related to code formatting.

Please run `./bin/standardize` prior submitting pull requests.

### 📦 Releasing

1. Make sure that you run `yarn` and `bundle` to pick up the latest.
1. Bump version number at `lib/cable_ready/version.rb`. Pre-release versions use `.preN`
1. Run `rake build` and `yarn build`
1. Commit and push changes to GitHub
1. Run `rake release`
1. Run `yarn publish --no-git-tag-version`
1. Yarn will prompt you for the new version. Pre-release versions use `-preN`
1. Commit and push changes to GitHub
1. Create a new release on GitHub ([here](https://github.com/stimulusreflex/cable_ready/releases)) and generate the changelog for the stable release for it

## 📝 License

CableReady is released under the [MIT License](LICENSE.txt).
