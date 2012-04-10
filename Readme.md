# Jest

__Note: Jest hasn't been "officially" released yet. Its still very much an experiment. Don't let that turn you away though! It should still work for you__

Jest is a tool for running [Jasmine](https://github.com/pivotal/jasmine) unit tests suser fast in the console without spinning up a browser. It also supports CoffeeScript.

Jest was created by a Rails 3.2 developer, who was writing many Jasmine specs, that wanted it to be extremely easy to run a single file from the command line and get super fast feedback.

![jest](https://github.com/keithpitt/jest/blob/master/docs/screenshot.png?raw=true)

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

## Configuration

Just like with `.rspec` you can define a `.jest` file. Within this file, you can place any command line option, and when Jest is run from that folder, it will merge those configuration options with those you pass in on the command line. For example:

```bash
-I "app/assets/javascript"
-I "vendor/assets/javascript"
```

This means you can just `jest spec/javascripts/assets/model_spec.js` and have it automatically know about included files.

## Installation

I have plans to properly release it as an npm module but in the mean time...

Make sure you have the latest versions of:

- [Node.JS](http://nodejs.org/)
- [PhantomJS](http://www.phantomjs.org/)

```
git clone git://github.com/keithpitt/jest.git
cd jest
npm install -g .
```

## Copyright

Copyright &copy; 2011 Keith Pitt. See LICENSE for details.
