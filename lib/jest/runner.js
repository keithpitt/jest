var coffeescript = require('coffee-script'),
    fs = require('fs'),
    path = require('path'),
    tmp = require('tmp'),
    exec = require('child_process').exec,
    glob = require('glob'),
    spawn = require('child_process').spawn;

function make_string(str, ascii_only) {
  var dq = 0, sq = 0;
  str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s){
    switch (s) {
      case "\\": return "\\\\";
      case "\b": return "\\b";
      case "\f": return "\\f";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\u2028": return "\\u2028";
      case "\u2029": return "\\u2029";
      case '"': ++dq; return '"';
      case "'": ++sq; return "'";
      case "\0": return "\\0";
    }
    return s;
  });
  if (ascii_only) str = to_ascii(str);
  if (dq > sq) return "'" + str.replace(/\x27/g, "\\'") + "'";
  else return '"' + str.replace(/\x22/g, '\\"') + '"';
};

function to_ascii(str) {
  return str.replace(/[\u0080-\uffff]/g, function(ch) {
    var code = ch.charCodeAt(0).toString(16);
    while (code.length < 4) code = "0" + code;
    return "";
  });
};


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
          p = base + '.coffee'; if(data = read(p)) { break; }
          p = base + '.js.coffee'; if(data = read(p)) { break; }
        } catch(e) {}
      }

      if(!p) {
        console.log("Could not find file `" + file + "` in the following paths:");
        console.log(localPaths);
        process.exit(1);
      }

      if(!data) {
        console.log("No data found in `" + p + "`");
        process.exit(1);
      }

      var actualFoundFile = p;

      var preparedTrees = data.replace(/(#|\/\/)\=\s*require_tree\s+(.+)/g, function() {

        var p = RegExp.$2;

        // Prepand the real path if it starts with a ./
        if(p.match(/\.\//)) {
          try {
            p = path.join(path.dirname(fs.realpathSync(actualFoundFile)), p);
            var globbedFiles = glob.sync(p + "/**/*.{js,coffee,js.coffee}")
            for(var x = 0, xl = globbedFiles.length; x < xl; x++) {
              unparsed.push(globbedFiles[x]);
            }
          } catch(e) {
            console.log("Could not find path `" + p + "`");
            console.log(e);
            process.exit(1);
          }
        }

        return '';
      });

      var prepared = data.replace(/(#|\/\/)\=\s*require\s+(.+)/g, function() {

        var p = RegExp.$2;

        // Prepand the real path if it starts with a ./
        if(p.match(/\.\//)) {
          try {
            p = path.join(path.dirname(fs.realpathSync(actualFoundFile)), p);
          } catch(e) {
            console.log("Could not find file `" + p + "`");
            process.exit(1);
          }
        }

        unparsed.push(p);

        return '';
      });

      try {
        console.log(p);
        if(p.match(/\.coffee/)) {
          try {
            javascript.push(coffeescript.compile(prepared));
          } catch(e) {
            console.log("Could not parse coffeescript file `" + p + "`");
            console.log(e);
          }
        } else {
          javascript.push('(function() { ' + to_ascii(prepared) + ' })();');
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
    var phantomer = path.join(root, "lib", "jest", "phantom.js");

    tmp.file({ postfix: '.js', keep: true }, function(err, path, fd) {
      if (err) throw err;

      fs.write(fd, javascript);
      fs.close(fd, function(err) {
        if (err) throw err;

        var html = template.replace(/\{\{vendor\}\}/g, vendor).replace(/\{\{source\}\}/g, "file://localhost" + path);

        tmp.file({ postfix: '.html', keep: true }, function(err, path, fd) {
          if (err) throw err;

          fs.write(fd, html);
          fs.close(fd, function(err) {
            if (err) throw err;

            if(options.browser) {
              spawn('open', ["file://" + path]);
            } else {
              var cmd = spawn('phantomjs', [ phantomer, "file://localhost" + path ]);

              cmd.stdout.on('data', function(data){
                process.stdout.write(data);
              });

              cmd.stderr.on('data', function(data){
                process.stderr.write(data);
              });

              cmd.on('exit', function(code){
                process.exit(code);
              });
            }
          });
        });

      });
    });


  }

}

module.exports = Runner;
