import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { daysBetween } from '../utils/daysBetween.js'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rentalsFile = path.join(__dirname, '../data', 'rentals.json');
const boatsFile = path.join(__dirname, '../data', 'boats.json');

const seedRentals = JSON.parse(fs.readFileSync(rentalsFile, 'utf-8'));
const boats = JSON.parse(fs.readFileSync(boatsFile, 'utf-8'));

let rentals = [...seedRentals]

router.get('/', (req, res) => {
    res.status(200).json(rentals)
})

router.post('/', (req, res) => {
    const { boatId, customerName, rentalStartDate, rentalEndDate } = req.body;

    if (boatId == null || !customerName || !rentalStartDate || !rentalEndDate) {
        return res.status(400).json({ greska: "Nisu uneseni svi potrebni podaci." });
    }

    const boat = boats.find(b => b.id === Number(boatId));
    if (!boat) {
        return res.status(404).json({ greska: `Brod s ID-om ${boatId} nije pronaden` });
    }
    if (typeof boat.cijenaPoDanu !== 'number') {
        return res.status(500).json({ greska: 'Brod nema definiranu cijenu' });
    }

    const days = daysBetween(rentalStartDate, rentalEndDate);
    if (!Number.isFinite(days) || days <= 0) {
        return res.status(400).json({ greska: 'Neispravan raspon datuma' });
    }

    const totalPrice = days * boat.cijenaPoDanu;

    const lastId = rentals.length > 0 ? rentals[rentals.length - 1].id : 0;
    const newId = lastId + 1;

    const newRental = {
        id: newId,
        boatId: Number(boatId),
        customerName,
        rentalStartDate,
        rentalEndDate,
        totalPrice
    };

    rentals.push(newRental);
    return res.status(201).json(newRental);
})

router.patch('/:id/dates', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ greska: 'Neispravan ID' });
    }

    const { rentalStartDate, rentalEndDate } = req.body;
    if (!rentalStartDate || !rentalEndDate) {
        return res.status(400).json({ greska: 'Neodstaju rentalStartDate i/ili rentalEndDate' });
    }

    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ greska: 'Neispravan format datuma' });
    }
    if (end < start) {
        return res.status(400).json({ greska: 'rentalEndDate ne smije biti raniji od rentalStartDate' });
    }

    const rental = rentals.find(r => r.id === id);
    if (!rental) {
        return res.status(404).json({ greska: `Najam s ID-om ${id} nije pronaden` })
    }

    const boat = boats.find(b => b.id === Number(rental.boatId))
    if (!boat) {
        return res.status(500).json({ greska: 'Povezani brod za ovaj najam ne postoji' });
    }
    if (typeof boat.cijenaPoDanu !== 'number') {
        return res.status(500).json({ greska: 'Brod nema definiranu cijenu' })
    }

    const days = daysBetween(rentalStartDate, rentalEndDate);
    if (!Number.isFinite(days) || days <= 0) {
        return res.status(400).json({ greska: 'Neispravan raspon datuma' })
    }

    rental.rentalEndDate = rentalEndDate;
    rental.rentalStartDate = rentalStartDate;
    rental.totalPrice = days * boat.cijenaPoDanu;
    
    return res.status(200).json(rental)
})


export default router;