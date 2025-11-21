import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import igorRouter from './routes/igortadic.js'
import porukeRouter from './routes/poruke.js'
import korisniciRouter from './routes/korisnici.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(igorRouter);
app.use('/poruke', porukeRouter);
app.use('/korisnici', korisniciRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
})

app.listen(PORT, error => {
    if (error) {
        console.log("Doslo je do pogreske prilikom pokretanja servera");
    } else {
        console.log(`wa-mid-A poslužitelj sluša na portu ${PORT}`);
    }
})