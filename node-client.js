#!/usr/bin/env node

var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080/fenix');
 
ws.on('open', function open() {
  ws.send('hello, server....');
});
 
ws.on('message', function(data, flags) {
  // flags.binary will be set if a binary data is received. 
  // flags.masked will be set if the data was masked. 
  console.log(flags.binary ? data.toString() : data);

});