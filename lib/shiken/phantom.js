var url = phantom.args[0];
var page = new WebPage();
var fs = require("fs"); 

page.onLoadStarted = function () {
  // console.log('Start loading...');
};

page.onLoadFinished = function (status) {
  // console.log('Loading finished.');
};

page.onConsoleMessage = function (msg) {
  if(msg.match(/SHIKEN: Failed \((\d+)\)/)) {
    var failed = parseInt(RegExp.$1);
    phantom.exit(failed > 0 ? 1 : 0);
  } else {
    // console.log("CONSOLE: " + msg);
    // console.log(msg);
    fs.write("/dev/stdout", msg, "w");
  }
};

page.open(url, function(status) {
  // console.log("Status: " + status);
});
