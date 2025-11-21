import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function citajKorisnike() {
    try {
        const korisnici = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/data.json'), 'utf-8')
        )
        return korisnici
    } catch (error) {
        console.error('Greska pri citanju datoteke: ', error.message);
        throw new Error('Greska pri citanju baze podataka');
    }
}

function spremiKorisnike(noviNiz) {
    fs.writeFileSync(
        path.join(__dirname, '../data/data.json'),
        JSON.stringify(noviNiz, null, 2),
        'utf-8'
    )
}

router.get('/', (req, res) => {
    try {
        const { ime, prezime } = req.query;
        let korisnici = citajKorisnike();

        if (ime) {
            korisnici = korisnici.filter(k => k.ime === ime)
        }

        if (prezime) {
            korisnici = korisnici.filter(k => k.prezime === prezime)
        }

        res.status(200).json(korisnici)
    } catch (error) {
        res.status(500).json({ greska: 'Greska pri citanju podataka', poruka: error.message });
    }
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ greska: "ID mora biti broj" })
    }
    const korisnici = citajKorisnike();
    const korisnik = korisnici.find(k => k.id === id);

    if (!korisnik) {
        return res.status(404).json({ greska: `Korisnik s ID-om ${id} ne postoji` })
    }

    res.status(200).json({ ...korisnik, message: `Uspjesno dohvacen korisnik s ID-om ${id}` });
})

router.post('/', (req, res) => {
    const { id, ime, prezime } = req.body;

    if (id !== undefined) {
        return res.status(400).json({ greska: "Greška! Ne unosite atribut ID." })
    }

    if (!ime) {
        return res.status(400).json({ greska: "Greska! Nedostaje atribut ime" })
    }

    if (!prezime) {
        return res.status(400).json({ greska: "Greska! Nedostaje atribut prezime" })
    }

    const korisnici = citajKorisnike();
    if (korisnici.some(k => k.id === id)) {
        return res.status(400).json({ greska: `Korisnik s ID-om ${id} vec postoji.` })
    }

    const noviId = korisnici.length > 0 ? Math.max(...korisnici.map(k => k.id)) + 1 : 1;

    const noviKorisnik = {
        id: noviId,
        ime,
        prezime
    }

    korisnici.push(noviKorisnik)
    spremiKorisnike(korisnici)

    res.status(201).json(korisnici)
})


export default router;
