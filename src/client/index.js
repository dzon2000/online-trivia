const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws');
ws.on('error', console.error);
ws.on('open', function open() {
    ws.send(JSON.stringify({
        action: "connect",
        role: "server"
    }));
});

const app = express()
const port = 8888
app.use(express.json()); // parse body to JSON
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/start', (req, res) => {
    // This should be for admins
    ws.send(JSON.stringify({
        action: "start",
        game: 123
    }));
    res.json({ok: 1})
})

app.use(express.static(path.join(__dirname, 'static')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)   
})
