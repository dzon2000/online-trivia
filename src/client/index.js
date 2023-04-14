const express = require('express');
const path = require('path');

const app = express()
const port = 8888
app.use(express.json()); // barse body to JSON
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.use(express.static(path.join(__dirname, 'static')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)   
})
