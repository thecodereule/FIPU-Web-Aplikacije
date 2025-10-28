const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello worl!');
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    }
    else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});

