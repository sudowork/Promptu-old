var sys = require('sys')
  , exec = require('child_process').exec
  , puts = function (error, stdout, stderr) {
    sys.puts(stdout);
    sys.puts(stderr);
  };

module.exports = function (cmd) {
  exec(cmd, puts);
};