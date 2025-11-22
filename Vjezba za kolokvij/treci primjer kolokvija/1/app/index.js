import express from 'express';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import boatsRouter from './routes/boats.js'
import rentalsRouter from './routes/rentals.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/boats', boatsRouter);
app.use('/rentals', rentalsRouter);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


app.listen(PORT, error => {
    if (error) {
        console.log("Doslo je do greske kod pokretanja posluzitelja")
    } else {
        console.log(`Posluzitelj slusa na portu ${PORT}`);
    }
})