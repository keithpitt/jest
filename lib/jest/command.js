var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    Runner = require('./runner');

Command = {

  run: function() {

    var args = process.argv.slice(2);

    // Really shitty option merging.

    try {
      var config = fs.readFileSync('.jest', 'ascii');
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

    var files = [];

    for(var i = 0, l = argv._.length; i < l; i++) {
      var file = argv._[i];
      var stat = fs.statSync(file);

      if(stat.isDirectory()) {
        var globbed = glob.sync(path.join(file, "**/*_spec.{js,coffee,js.coffee}"));
        files = files.concat(globbed);
      } else {
        files.push(file);
      }
    }

    runner = new Runner({ requires: argv.r || [], paths: argv.I || [], files: files });
    runner.run();
  }

}

module.exports = Command;
