var coffeescript = require('coffee-script'),
    fs = require('fs'),
    path = require('path'),
    temp = require('temp'),
    phantom = require('phantom'),
    exec = require('child_process').exec;

function Runner(options) {

  var paths = [ path.normalize('.') ].concat(options.paths);

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

      // Find the file
      for(var i = 0, l = paths.length; i < l; i++) {
        try {
          var base = path.join(paths[i], file);

          p = base; if(data = read(p)) { break; }
          p = base + '.js'; if(data = read(p)) { break; }
          p = base + '.js.coffee'; if(data = read(p)) { break; }
        } catch(e) {}
      }

      if(!data || !p) {
        console.log("Could not find file `" + file + "` in the following paths:");
        console.log(paths);
        process.exit(1);
      }

      var prepared = data.replace(/#\=\s*require\s*(.+)/g, function(full, file) {
        unparsed.push(file);
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

   // temp.open({ suffix: '.html' }, function(err, info) {
   //   if (err) throw err;
   //   fs.write(info.fd, html);
   //   fs.close(info.fd, function(err) {
   //     if (err) throw err;
   //     exec("open '" + info.path + "'");
   //   });
   // });

    console.log(html);
  }

}

module.exports = Runner;
