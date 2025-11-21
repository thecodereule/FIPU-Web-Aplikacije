import express from 'express';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import korisniciRouter from './routes/korisnici.js'

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/korisnici', korisniciRouter)

app.get('/protected', (req, res) => {
    const { api_key } = req.query;

    if (!api_key) {
        return res.status(401).json({ greska: "API kljuc nije poslan" });
    }

    if (api_key !== process.env.API_KEY) {
        return res.status(403).json({ greska: "Pristup nije dozvoljen" })
    }

    res.status(200).json({ poruka: "Super secret protected content!!!" })
})


app.get('/', (req, res) => {
    res.status(200).send("Pozdrav, Igor Tadic!")
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska pri pokretanju servera`);
    } else {
        console.log(`Posluzitelj slusa na portu ${PORT}`);
    }
})

