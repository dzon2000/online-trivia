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
            registerNewClient(client, message);
        }
        if ("fetch" === message.action) { // Fetch all clients for initial lobby list
            const response = [];
            [...clients.keys()].forEach((client) => {
                if (client.readyState === client.OPEN) {
                    response.push({
                        name: clients.get(client).name
                    })
                }
            });
            sendAll({
                action: "fetch",
                data: response
            });
        }
    });
    ws.send(JSON.stringify({
        action: "greet",
        message: "Welcome!"
    }));
});

wss.on("close", () => {
    clients.delete(ws);
});

function registerNewClient(client, message) {
    client.name = message.name;
    message.id = client.id;
    sendAll(message);
    console.log("=======================");
    [...clients.keys()].forEach((client) => {
        console.log(`${clients.get(client).name} : ${client.readyState}`);
    });
}

function sendAll(message) {
    [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}