const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    const id = uuidv4();
    const score = 0;
    const role = "participant"
    const name = "John"
    const metadata = { id, score, role, name }
    clients.set(ws, metadata);

    ws.on('message', function message(data) {
        console.log(`Raw data: ${data}`);
        const message = JSON.parse(data);
        const client = clients.get(ws);
        if ("register" === message.action && message.name) {
            client.name = message.name;
            message.id = client.id;
            [...clients.keys()].forEach((client) => {
                client.send(JSON.stringify(message));
            });
            console.log(clients)
        }
    });
    ws.send('Welcome!');
});

wss.on("close", () => {
    clients.delete(ws);
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}