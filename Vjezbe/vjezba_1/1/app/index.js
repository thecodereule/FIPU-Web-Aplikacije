import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

const korisnici = [
    {id: 1, ime: "Marko", prezime: "Marić"},
    {id: 1, ime: "Ana", prezime: "Anic"},
    {id: 1, ime: "Stipe", prezime: "Stipic"}
]

app.get('/', (req, res) => {
    let putanja = path.join('public', 'error.html');
    let aps_putanja = path.resolve(putanja)
    res.sendFile(aps_putanja)
})

app.get('/korisnici', (req, res) => {
    res.json(korisnici)
})

app.listen(PORT, error => {
    if (error) {
        console.log('Doslo je do pogreske pri pokretanju posluzitelja')
    }
    console.log(`Express server je pokrenut na portu ${PORT}`)
})