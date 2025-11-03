import express from 'express';
import { nekretnine } from './nekretnine.js';

const router = express.Router();

// in-memory podaci
let ponude = [];
let nextPonudaId = 1;

router.post('/', (req, res) => {
    const { id_nekretnine, ime_kupca, prezime_kupca, ponudena_cijena, broj_telefona } = req.body;

    if (!id_nekretnine || !ime_kupca || !prezime_kupca || ponudena_cijena == null || !broj_telefona) {
        return res.status(400).json({message: "Svi podaci su obavezni (id_nekretnine, ime_kupca, prezime_kupca, ponudena_cijena, broj_telefona)."});
    }

    const nekretninaId = parseInt(id_nekretnine);
    if (isNaN(nekretninaId)) {
        return res.status(400).json({message: "ID nekretnine mora biti broj."});
    }

    if (ponudena_cijena <= 0) {
        return res.status(400).json({message: "Ponudena cijena mora biti pozitivan broj."});
    }

    const nekretninaPostoji = nekretnine.find(n => n.id === nekretninaId);
    if (!nekretninaPostoji) {
        return res.status(404).json({message: "Nekretnina s navedenim ID-om ne postoji."});
    }

    const novaPonuda = {
        id_ponude: nextPonudaId++,
        id_nekretnine: nekretninaId,
        ime_kupca,
        prezime_kupca,
        ponudena_cijena,
        broj_telefona
    };

    ponude.push(novaPonuda);
    res.status(201).json(novaPonuda);
});

export default router;