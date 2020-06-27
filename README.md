<p align="center">
  <img src="assets/cable-ready-logo-with-copy.svg" width="360" />
  <h1 align="center">Welcome to CableReady 👋</h1>
  <p align="center">
    <img src="https://img.shields.io/gem/v/cable_ready.svg?color=red" />
    <img src="https://img.shields.io/npm/v/cable_ready.svg?color=blue" />
    <a href="https://www.npmjs.com/package/cable_ready">
      <img alt="downloads" src="https://img.shields.io/npm/dm/cable_ready.svg?color=blue" target="_blank" />
    </a>
    <a href="https://github.com/hopsoft/cable_ready/blob/master/LICENSE">
      <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-brightgreen.svg" target="_blank" />
    </a>
    <a href="http://blog.codinghorror.com/the-best-code-is-no-code-at-all/" target="_blank">
      <img alt="Lines of Code" src="https://img.shields.io/badge/lines_of_code-375-brightgreen.svg?style=flat" />
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
    <a href="https://codeclimate.com/github/hopsoft/cable_ready/maintainability" target="_blank">
      <img alt="Maintainability" src="https://api.codeclimate.com/v1/badges/83ddf1fee4af7e51a681/maintainability" />
    </a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/hopsoft/cable_ready/workflows/Prettier-Standard/badge.svg">
      <img src="https://github.com/hopsoft/cable_ready/workflows/Prettier-Standard/badge.svg" alt="Prettier-Standard" style="max-width:100%;">
    </a>
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/hopsoft/cable_ready/workflows/StandardRB/badge.svg">
      <img src="https://github.com/hopsoft/cable_ready/workflows/StandardRB/badge.svg" alt="StandardRB" style="max-width:100%;">
    </a>
  </p>
</p>
<br />

CableReady helps you create great real-time user experiences by making it simple to trigger client-side DOM changes from server-side Ruby. It establishes a standard for interacting with the client via ActionCable web sockets. No need for custom JavaScript.

Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html)
to learn more about ActionCable before proceeding.

## 📚 Docs

- [Official Documentation](https://cableready.stimulusreflex.com)
- [Documentation Source Code](https://github.com/hopsoft/cable_ready/tree/master/docs)

## 💙 Community

- [Discord](https://discord.gg/XveN625) - chat root

## 🚀 Install

```sh
bundle add cable_ready && yarn add cable_ready
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

1. Bump version number at `lib/cable_ready/version.rb`
1. Run `rake build`
1. Run `rake release`
1. Change directories `cd ./javascript`
1. Run `yarn publish` - NOTE: this will throw a fatal error because the tag already exists but the package will still publish

## 📝 License

CableReady is released under the [MIT License](LICENSE.txt).
