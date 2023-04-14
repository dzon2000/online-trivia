const WebSocket = require('ws');

const questions = [
    {
        id: 1,
        q: "Whose role is to keep track of project plan?",
        a: [
            "Project Manager",
            "Architect",
            "Developer",
            "Test Manager"
        ],
        c: "Project Manager",
        f: true
    },
    {
        id: 2,
        q: "Should Architect code?",
        a: [
            "Yes",
            "No",
            "It depends",
            "Never"
        ],
        c: "Yes",
        f: true
    }
];


const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

var questionNum = 0;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    const id = uuidv4();
    const score = 0;
    const role = "none"
    const name = "John"
    const metadata = { id, score, role, name }
    clients.set(ws, metadata);

    ws.on('message', function message(data) {
        console.log(`Raw data: ${data}`);
        const message = JSON.parse(data);
        const client = clients.get(ws);
        if ("register" === message.action && message.name) {
            registerNewClient(client, message);
        } else if ("fetch" === message.action) { // Fetch all clients for initial lobby list
            fetchAllClientsWaitingForTheGame();
        } else if ("start" === message.action) { // Start the game
            sendAll(
                {
                    action: "start", 
                    q: questions[questionNum++ % 2]
                });
        } else if ("answer" === message.action) { // Got the answer
            if (message.answer === questions[questionNum % 2].c) {
                client.score += 1000;
            }
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

function fetchAllClientsWaitingForTheGame() {
    const response = [];
    [...clients.keys()].forEach((client) => {
        const metadata = clients.get(client);
        if (client.readyState === client.OPEN && metadata.role === 'participant') {
            response.push({
                name: metadata.name
            });
        }
    });
    sendAll({
        action: "fetch",
        data: response
    });
}

function registerNewClient(client, message) {
    client.name = message.name;
    client.role = "participant";
    message.id = client.id;
    sendAll(message);
}

function sendAll(message) { // TODO: send only to active clients plus only for the specific game
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