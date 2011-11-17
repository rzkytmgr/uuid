var assert = require('assert'),
    nodeuuid = require('../uuid'),
    uuidjs = require('uuid-js'),
    libuuid = require('uuid').generate,
    util = require('util'),
    exec = require('child_process').exec;

function compare(ids) {
  var sorted = ([].concat(ids)).sort();
  console.log(ids);
  if (sorted.toString() !== ids.toString()) {
    console.log('Warning: sorted !== ids');
  }
}

// Test time order of v1 uuids
var ids = [];
while (ids.length < 10e3) ids.push(nodeuuid.v1());

var max = 10;
console.log('node-uuid:');
ids = [];
for (var i = 0; i < max; i++) ids.push(nodeuuid.v1());
compare(ids);

console.log('');
console.log('uuidjs:');
ids = [];
for (var i = 0; i < max; i++) ids.push(uuidjs.create(1).toString());
compare(ids);

console.log('');
console.log('libuuid:');
ids = [];
var count = 0;
var last = function() {
  compare(ids);
}
var cb = function(err, stdout, stderr) {
  ids.push(stdout.substring(0, stdout.length-1));
  count++;
  if (count < max) {
    return next();
  }
  last();
};
var next = function() {
  exec('uuid -1', cb);
};
next();
