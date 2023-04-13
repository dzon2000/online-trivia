const express = require('express');
const path = require('path');

// const ws = new WebSocket('ws://localhost:3000/ws');
// ws.on('error', console.error);

// ws.on('open', function open() {
//     // ws.send('something');
// });

// ws.on('message', function message(data) {
//     console.log('received: %s', data);
// });

const app = express()
const port = 8888
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port, () => {
    console.log(__dirname)  
    console.log(`Example app listening on port ${port}`)
})




