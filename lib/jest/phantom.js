var url = phantom.args[0];
var page = new WebPage();
var fs = require("fs"); 

page.onLoadStarted = function () {
  // console.log('Start loading...');
};

page.onLoadFinished = function (status) {
  // console.log('Loading finished.');
};

page.onConsoleMessage = function (msg, line, source) {
  if(msg.match(/JEST: Failed \((\d+)\)/)) {
    var failed = parseInt(RegExp.$1);
    phantom.exit(failed > 0 ? 1 : 0);
  } else {
    if(line || source) {
      fs.write("/dev/stdout", msg + " " + source + ":" + line + "\n", "w");
    } else {
      fs.write("/dev/stdout", msg + "\n", "w");
    }
    // console.log("CONSOLE: " + msg);
    // console.log(msg);
  }
};

page.onResourceRequested = function() {
  // console.log(arguments);
}

page.onError = function (msg, trace) {
  console.log(msg);
  trace.forEach(function(item) {
    console.log('  ', item.file, ':', item.line);
  })
}

page.open(url, function(status) {
  if(status == 'fail') {
    console.log("Failed to open: " + url);
  }
});
