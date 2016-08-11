const fs = require('fs');
const httpServer = require('http').createServer();
const WebSocketServer = require('ws').Server;

const port = 8080;

function errorHandler(error) {
    console.log(error);
}

function headersHandler(headers) {
    console.log(headers);
}

function getWebSocketServer(path, cb) {
    let _wss = new WebSocketServer({
        server: httpServer,
        path: path
    })
    _wss.path = path;

    cb(_wss)

    return _wss;
}

getWebSocketServer('/fenix', wss => {
    wss.on('error', errorHandler);
    wss.on('headers', headersHandler);
    wss.on('connection', function connection(ws) {

        console.log('client connected');
        console.log('clients number:', wss.clients.length);
        console.log(ws.upgradeReq.url);

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);

            ws.send(`echo: ${message}`);
        });

        let timer = setInterval(() => {
            ws.send(`live: ${Date.now()} `, {
                // binary: true
            })
        }, 2000)


        ws.on('close', (code) => {
            console.log('client closed!', code);
            console.log('clients number:', wss.clients.length);

            clearInterval(timer);
        })
    });
})


getWebSocketServer('/echo', wss => {
    wss.on('connection', ws => {
        console.log('connected', ws);
        ws.on('message', msg => {
            console.log(`${wss.path} received: ${msg}`);
            ws.send(`You say: "${msg}" ？`)
        })
    })
})

httpServer.on('connect', (req, res) => {
    let file;
    let url = (req.url == '/') ? './index.html' : '.' + req.url
    try {
        file = fs.readFileSync(url)
    } catch (err) {
        file = 'Not find: ' + url
        res.statusCode = 404
    }
    res.end(file);
})

httpServer.listen(port, () => console.log(`Listening on http://0.0.0.0:${port}`))
