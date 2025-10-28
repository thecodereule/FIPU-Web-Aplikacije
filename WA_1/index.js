const express = require('express');
const app = express();

const users = require('./users')

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    }
    else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});

