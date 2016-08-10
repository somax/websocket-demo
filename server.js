var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8080,
        path:'/fenix'
    });



wss.on('connection', function connection(ws) {

    console.log('client connected' );
    console.log('clients number:' ,wss.clients.length);
    console.log(ws.upgradeReq.url);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        ws.send(`echo: ${message}`);
    });

    let timer = setInterval(() => {
        ws.send(`live: ${Date.now()} `, {
        // binary: true
    }
    )}, 2000)


    ws.on('close', (code) => {
        console.log('client closed!', code);
        console.log('clients number:',wss.clients.length);

        clearInterval(timer);
    })


});