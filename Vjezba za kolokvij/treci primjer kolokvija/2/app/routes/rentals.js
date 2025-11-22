import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rentalsFile = path.join(__dirname, '../data', 'rentals.json');
const boatsFile = path.join(__dirname, '../data', 'boats.json');

const seedRentals = JSON.parse(fs.readFileSync(rentalsFile, 'utf-8'));
const seedBoats = JSON.parse(fs.readFileSync(boatsFile, 'utf-8'));

const rentals = [...seedRentals];

router.get('/', (req, res) => {
    if (rentals.length < 0) {
        return res.status(404).json({greska: "Lista najama je prazna"});
    }
    res.status(200).json(rentals)
})

router.post('/', (req, res) => {
    const {}
})

export default router;