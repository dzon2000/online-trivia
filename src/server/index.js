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

const qLen = questions.length;


const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

var questionNum = 0;
let answersCount = 0;

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
            answersCount = 0;
            sendAll(
                {
                    action: "start", 
                    q: questions[questionNum++ % qLen]
                });
        } else if ("answer" === message.action) { // Got the answer
            let playersCount = countPlayers();
            answersCount++;
            if (message.answer == questions[(questionNum - 1) % qLen].c) {
                client.score += 1000;
                ws.send(JSON.stringify({
                    action: "feedback",
                    score: client.score
                }));
            }
            console.log(`We have ${playersCount} players and ${answersCount} answers!`);
            if (answersCount == playersCount) { // Everyone sent the answer
                sendAll(
                    {
                        action: "rank", 
                        rank: getRanking()
                    });
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

function countPlayers() {
    let count = 0;
    [...clients.keys()].forEach((client) => {
        const metadata = clients.get(client);
        if (client.readyState === client.OPEN && metadata.role === 'participant') {
            count++;
        }
    });
    return count;
}

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

function getRanking() {
    const response = [];
    [...clients.keys()].forEach((client) => {
        const metadata = clients.get(client);
        if (client.readyState === client.OPEN && metadata.role === 'participant') {
            response.push({
                name: metadata.name,
                score: metadata.score
            });
        }
    });
    return response;
}