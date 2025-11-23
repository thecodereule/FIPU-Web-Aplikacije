import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const boatsFile = path.join(__dirname, '../data', 'boats.json');
const seedBoats = JSON.parse(fs.readFileSync(boatsFile, 'utf-8'));

let boats = [...seedBoats];

function normalizeName(str) {
    return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
}

router.get('/', (req, res) => {
    if (boats.length < 1) {
        return res.status(404).json({ greska: "Lista brodova je prazna" });
    }
    res.status(200).json(boats)
})

router.get('/:naziv', (req, res) => {
    const queryName = normalizeName(req.params.naziv);
    const pronadeni_brod = boats.find(b => normalizeName(b.naziv) === queryName);

    if (!pronadeni_brod) {
        return res.status(404).json({ greska: `Brod s nazivom ${req.params.naziv} ne postoji u bazi` });
    }

    return res.status(200).json(pronadeni_brod);
})

router.post('/', (req, res) => {
    const REQUIRED_KEYS = ['naziv', 'tip', 'duljina', 'cijenaPoDanu', 'motor_hp'];
    const bodyKeys = Object.keys(req.body).sort();
    const requiredKeys = [...REQUIRED_KEYS].sort();

    const hasExactKeys = bodyKeys.length === requiredKeys.length && bodyKeys.every((k, i) => k === requiredKeys[i]);

    if (!hasExactKeys) {
        return res.status(400).json({ greska: `Tijelo zahtjeva mora imati tocne kljuceve: ${REQUIRED_KEYS.join(', ')}` });
    }

    const { naziv, tip, duljina, cijenaPoDanu, motor_hp } = req.body;

    const queryName = normalizeName(naziv);
    const postoji = boats.some(b => normalizeName(b.naziv) === queryName);

    if (postoji) {
        return res.status(409).json({greska: `Brod s nazivom ${naziv} vec postoji`});
    }

    const posljednjiId = boats.length > 0 ? boats[boats.length - 1].id : 0;
    const noviId = posljednjiId + 1;

    const noviBrod = {
        id: noviId,
        naziv,
        tip,
        duljina,
        cijenaPoDanu,
        motor_hp
    };

    boats.push(noviBrod);
    return res.status(201).json(noviBrod);
})

export default router;