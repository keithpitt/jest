var coffeescript = require('coffee-script'),
    fs = require('fs'),
    path = require('path'),
    temp = require('temp'),
    phantom = require('phantom'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn;

function Runner(options) {

  var paths = [ '',  path.normalize('.') ].concat(options.paths);

  function read(path) {
    try {
      return fs.readFileSync(path, 'ascii');
    } catch(e) {
      return false;
    }
  }

  this.parse = function(file) {
    var unparsed = [].concat(options.files).concat(options.requires),
        javascript = [];

    while(unparsed.length > 0) {
      var file = unparsed.shift();
      var data = null, p = null;
      var localPaths = [].concat(paths);

      // Find the file
      for(var i = 0, l = localPaths.length; i < l; i++) {
        try {
          var base = path.join(localPaths[i], file);

          p = base; if(data = read(p)) { break; }
          p = base + '.js'; if(data = read(p)) { break; }
          p = base + '.js.coffee'; if(data = read(p)) { break; }
        } catch(e) {}
      }

      if(!data || !p) {
        console.log("Could not find file `" + file + "` in the following paths:");
        console.log(localPaths);
        process.exit(1);
      }

      var prepared = data.replace(/(#|\/\/)\=\s*require\s*(.+)/g, function() {

        var p = RegExp.$2;

        // Prepand the real path if it starts with a ./
        if(p.match(/\.\//)) {
          p = path.join(path.dirname(fs.realpathSync(file)), p);
        }

        unparsed.push(p);

        return '';
      });

      try {
        if(p.match(/.js.coffee/)) {
          javascript.push(coffeescript.compile(prepared));
        } else {
          javascript.push(prepared);
        }
      } catch(e) {
        console.log(p);
        console.log(e);
        process.exit(1);
      }
    }

    return javascript.reverse().join('\n');
  }

  this.run = function() {
    var javascript = this.parse();

    var root = path.join(path.dirname(fs.realpathSync(__filename)), '../../');
    var template = fs.readFileSync(path.join(root, 'templates/runner.html'), 'ascii');
    var vendor = "file://localhost" + path.resolve(root);

    var html = template.replace(/\{\{vendor\}\}/g, vendor).replace(/\{\{javascript\}\}/g, javascript);
    var phantomer = path.join(root, "lib", "jasmine-cli", "phantom.js");

    temp.open({ suffix: '.html' }, function(err, info) {
      if (err) throw err;
      fs.write(info.fd, html);
      fs.close(info.fd, function(err) {
        if (err) throw err;

        var cmd = spawn('phantomjs', [ phantomer, "file://localhost" + info.path ]);

        cmd.stdout.on('data', function(data){
          process.stdout.write(data);
        });

        cmd.stderr.on('data', function(data){
          process.stderr.write(data);
        });

        cmd.on('exit', function(code){
          process.exit(code);
        });
      });
    });
  }

}

module.exports = Runner;
