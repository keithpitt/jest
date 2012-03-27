# jest

_Note: I wrote this in about 3 hours, it's probably buggy as hell, but give it a go if you'r keen._

jest is a tool for running Jasmine unit tests user fast in the console without spinning up a browser.

## Usage

```bash
jest something_spec.js
```

jest supports CoffeeScript, so if you file looks something like this:

`jest something_spec.js.coffee`, it will just work.

## Sprockets

jest copies the sprockets API. Which means you can write things like this in your specs and have them work as you'd expect.

```javascript
//= require ./src/player
//= require ./src/song
```

## Installation

At the moment, you need to clone down the repo, symlink the bin file and use it that way. I have plans to properly release it as an npm module in the future.

## Note on Patches/Pull Requests

1. Fork the project.
2. Make your feature addition or bug fix.
3. Add tests for it. This is important so I don't break it in a future version unintentionally.
4. Commit, do not mess with rakefile, version, or history. (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
5. Send me a pull request. Bonus points for topic branches.

## Copyright

Copyright &copy; 2011 Keith Pitt. See LICENSE for details.
