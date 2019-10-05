[![Lines of Code](http://img.shields.io/badge/lines_of_code-268-brightgreen.svg?style=flat)](http://blog.codinghorror.com/the-best-code-is-no-code-at-all/)
[![Maintainability](https://api.codeclimate.com/v1/badges/83ddf1fee4af7e51a681/maintainability)](https://codeclimate.com/github/hopsoft/cable_ready/maintainability)

# CableReady

## Out-of-Band Server Triggered DOM Operations

CableReady provides a simple interface for triggering client-side DOM operations
from the server via [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html)
to learn more about ActionCable before proceeding.

## Docs

- [Official Documentation](https://docs.cableready.com)
- [Documentation Source Code](https://github.com/hopsoft/cable_ready/tree/master/docs)

## Contributing

### Code of Conduct

Everyone interacting with CableReady is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md)

### Coding Standards

This project uses [Standard](https://github.com/testdouble/standard)
and [prettier-standard](https://github.com/sheerun/prettier-standard) to minimize bike shedding related to code formatting.

Please run `./bin/standardize` prior submitting pull requests.

### Releasing

1. Bump version number at `lib/cable_ready/version.rb`
1. Run `rake build`
1. Run `rake release`
1. Change directories `cd ./javascript`
1. Run `yarn publish` - NOTE: this will throw a fatal error because the tag already exists but the package will still publish

## License

CableReady is released under the [MIT License](LICENSE.txt).
