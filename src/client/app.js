const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws');
ws.on('error', console.error);

ws.on('open', function open() {
    const message = {
        action: "register",
        name: "Piotr"
    }
    ws.send(JSON.stringify(message));
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});