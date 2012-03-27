# Jest

_Note: I wrote this in about 3 hours, it's probably buggy as hell, but give it a go if you're keen._

Jest is a tool for running [Jasmine](https://github.com/pivotal/jasmine) unit tests user fast in the console without spinning up a browser. It also supports CoffeeScript.

## Usage

```bash
jest something_spec.js
jest specs/
jest something_spec.js.coffee
jest something_spec.coffee
```

## Sprockets

Jest copies the [Sprockets](https://github.com/sstephenson/sprockets) API. Which means you can write things like this in your specs and have them work as you'd expect.

```javascript
//= require ./src/player
//= require ./src/song
```

You can use the command line option `-I` to include a path that the required files will look for in. For example, if you do this:

```javascript
//= require jquery
```

You can define what folder to look for the `jquery` file in like so:

```bash
jest -I vendor/assets/javascript specs/player_spec.js
```

## Installation

At the moment, you need to clone down the repo, symlink the bin file and use it that way. I have plans to properly release it as an npm module in the future.

After you have cloned down the repo, make sure you have the following and latest versions of:

- [Node.JS](http://nodejs.org/)
- [PhantomJS](http://www.phantomjs.org/)

## Note on Patches/Pull Requests

1. Fork the project.
2. Make your feature addition or bug fix.
3. Add tests for it. This is important so I don't break it in a future version unintentionally.
4. Commit, do not mess with rakefile, version, or history. (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
5. Send me a pull request. Bonus points for topic branches.

## Copyright

Copyright &copy; 2011 Keith Pitt. See LICENSE for details.
