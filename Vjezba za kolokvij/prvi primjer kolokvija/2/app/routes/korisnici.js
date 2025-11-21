import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const korisnici = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/korisnici.json'), 'utf-8')
)

const poruke = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/poruke.json'), 'utf-8')
)

router.get('/', (req, res) => {
    res.status(200).json(korisnici)
})

router.get('/:id', (req, res) => {
    const id_korisnik = parseInt(req.params.id);
    const korisnik = korisnici.find(k => k.id === id_korisnik)

    if (!korisnik) {
        return res.status(404).json({ greska: `Korisnik s idom ${id_korisnik} ne postoji` })
    }

    res.status(200).json(korisnik);
})

router.get('/:id/poruke', (req, res) => {
    const { date_sort } = req.query;
    const id_korisnik = parseInt(req.params.id);

    if (isNaN(id_korisnik)) {
        return res.status(400).json({ greska: "Neispravan ID" })
    }

    const korisnik = korisnici.find(k => k.id === id_korisnik)

    if (!korisnik) {
        return res.status(404).json({ greska: `Korisnik s idom ${id_korisnik} ne postoji` })
    }

    const poruke_korisnika = poruke.filter(p => p.posiljatelj === korisnik.ime)

    if (poruke_korisnika.length === 0) {
        return res.status(404).json({ greska: `Korisnik ${korisnik.ime} nema poslanih poruka` })
    }

    if (date_sort && poruke_korisnika.length === 1) {
        return res.status(400).json({ greska: "Nema dovoljno podataka za sortiranje" });
    }

    if (date_sort && date_sort !== 'asc' && date_sort !== 'desc') {
        return res.status(400).json({ greska: "date_sort mora biti 'asc' ili 'desc' " })
    }

    if (date_sort && poruke_korisnika.length > 1) {
        if (date_sort === 'asc') {
            poruke_korisnika.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (date_sort === 'desc') {
            poruke_korisnika.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    }

    res.status(200).json(poruke_korisnika)
})


export default router;