#!/usr/bin/env node

const WebSocket = require('ws');

function connect() {
    console.log('connecting...');
    let ws = new WebSocket('ws://localhost:8080/echo');
    let timer;
    ws.on('open', function open() {
        console.log('connected!');
        timer = setInterval(() => ws.send(`hello, server. ${Date.now()}`), 2000);
    });

    ws.on('close', event => {
        console.log('lost connection!');
        clearInterval(timer);
        setTimeout(connect, 2000)
    })

    ws.on('message', function(data, flags) {
        console.log(flags.binary ? data.toString() : data);
    });

    return ws;
}

connect();
