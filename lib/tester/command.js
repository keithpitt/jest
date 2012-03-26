var fs = require('fs'),
    path = require('path'),
    Runner = require('./runner');

Command = {

  run: function() {
    var argv = require('optimist')
        .usage('Usage: tester [options] [files or directories]')
        .describe('I', 'Specify PATH to add to require.paths (may be used more than once)')
        .describe('-r', 'Require a file.')
        .alias('--require', '-r')
        .argv;

    runner = new Runner({ requires: argv.r || [], paths: argv.I || [], files: argv._ });
    runner.run();
  }

}

module.exports = Command;
