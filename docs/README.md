---
description: A simple interface for triggering client-side DOM operations
from the server via ActionCable
---

# CableReady

[![GitHub stars](https://img.shields.io/github/stars/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![GitHub forks](https://img.shields.io/github/forks/hopsoft/cable_ready?style=social)](https://github.com/hopsoft/cable_ready) [![Twitter follow](https://img.shields.io/twitter/follow/hopsoft?style=social)](https://twitter.com/hopsoft)

## Out-of-Band Server Triggered DOM Operations

CableReady provides a simple interface for triggering client-side DOM operations
from the server via [ActionCable](http://guides.rubyonrails.org/action_cable_overview.html).

Please read the official [ActionCable docs](http://guides.rubyonrails.org/action_cable_overview.html)
to learn more about ActionCable before proceeding.


## Contributing

This project uses [Standard](https://github.com/testdouble/standard)
and [Prettier](https://github.com/prettier/prettier) to minimize bike shedding related to code formatting.

Please run `./bin/standardize` prior submitting pull requests.

### Releasing

1. Bump version number at `lib/cable_ready/version.rb`
1. Run `rake build`
1. Run `rake release`
1. Change directories `cd ./javascript`
1. Run `yarn publish` - NOTE: this will throw a fatal error because the tag already exists but the package will still publish

## License

CableReady is released under the [MIT License](LICENSE.txt).
