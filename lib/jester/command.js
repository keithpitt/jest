var fs = require('fs'),
    path = require('path'),
    Runner = require('./runner');

Command = {

  run: function() {

    var args = process.argv.slice(2);

    // Really shitty option merging.

    try {
      var config = fs.readFileSync('.jester', 'ascii');
    } catch(e) { }

    if(config) {
      var locals = [];
      var lines = config.split('\n');

      for(var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];

        if(line) {
          var parts = line.split(' ');
          if(parts.length) {
            locals.push(parts.shift())
            locals.push(parts.join(' ').replace(/^"|"$/g, ''))
          }
        }
      }

      args = locals.concat(args);
    }

    var argv = require('optimist')
        .usage('Usage: tester [options] [files or directories]')
        .describe('I', 'Specify PATH to add to require.paths (may be used more than once)')
        .describe('-r', 'Require a file.')
        .alias('--require', '-r')
        .parse(args);

    runner = new Runner({ requires: argv.r || [], paths: argv.I || [], files: argv._ });
    runner.run();
  }

}

module.exports = Command;
