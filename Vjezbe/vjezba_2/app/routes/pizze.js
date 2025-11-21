import express from 'express'
import { checkArray, same_arrays } from '../utils/index.js';
import { dostupne_pizze } from '../data/pizze_data.js';

const router = express.Router();



let dozvoljeni_kljucevi = ["naziv", "cijena"]; // HTTP zahtjev

const nazivi_dostupnih_pizza = dostupne_pizze.map(pizza => pizza.naziv);


router.get('/', (req, res) => {
    if (!checkArray(dostupne_pizze)) {
        res.status(500).json({ greska: "Podacima se ne moze pristupiti" });
    }

    res.status(200).json(dostupne_pizze)
})

router.get('/:naziv', (req, res) => {
    if (!checkArray(dostupne_pizze)) {
        res.status(500).json({ greska: "Podacima se ne moze pristupiti" });
    }

    let naziv_pizze = req.params.naziv;

    if (!isNaN(naziv_pizze)) {
        return res.status(400).json({ greska: "Neispravan podatak" })
    }

    let trazena_pizza = dostupne_pizze.find(p => p.naziv === naziv_pizze)

    if (trazena_pizza) {
        return res.json(trazena_pizza);
    }
    return res.status(404).json({ poruka: "Ne postoji trazena pizza" })
})

router.post('/', (req, res) => {
    if (!req.body) {
        return res.json({ greska: "http body je prazan" })
    }

    let pizza_dodavanje = req.body

    let kljucevi_pizze = Object.keys(pizza_dodavanje)

    if (!same_arrays(dozvoljeni_kljucevi, kljucevi_pizze)) {
        return res.status(400).json({ greska: "Kljucevi se ne podudaraju" })
    }

    let postojeca = dostupne_pizze.find(p => p.naziv === pizza_dodavanje.naziv);
    if (postojeca) {
        res.status(400).json({ greska: `Pizza s nazivom ${postojeca.naziv} vec postoji` })
    }

    const novi_id = dostupne_pizze.at(-1)['id'] + 1;
    dostupne_pizze.push({ id: novi_id, ...pizza_dodavanje })
    nazivi_dostupnih_pizza.push(pizza_dodavanje.naziv)

    res.status(201).json(dostupne_pizze);
})

router.delete('/:naziv', (req, res) => {
    let naziv_brisanje = req.params.naziv

    if (!isNaN(naziv_brisanje) || !nazivi_dostupnih_pizza.includes(naziv_brisanje)) {
        return res.status(400).json({ greska: "Neispravan podatak" })
    }

    let pizza_za_brisanje = dostupne_pizze.findIndex(p => p.naziv === naziv_brisanje);

    if (pizza_za_brisanje != -1) {
        dostupne_pizze.splice(pizza_za_brisanje, 1)
        return res.status(204).json(dostupne_pizze)
    } else {
        return res.status(404).json({ poruka: "Ne mogu pronaci pizzu" })
    }
})

router.put('/:naziv', (req, res) => {
    let naziv_pizza_zamjena = req.params.naziv;

    if (!isNaN(naziv_pizza_zamjena) || !nazivi_dostupnih_pizza.includes(naziv_pizza_zamjena)) {
        return res.status(400).json({ greska: "Neispravan podatak" })
    }

    let nova_pizza = req.body;
    let nova_pizza_kljucevi = Object.keys(nova_pizza);

    let nova_pizza_cijena = req.body.cijena;

    if (nova_pizza_cijena <= 0) {
        return res.status(400).json({ greska: "Cijena ne smije biti manja ili jednaka 0" })
    }

    if (!nova_pizza) {
        return res.status(400).json({ greska: "Neispravan podatak" })
    }

    let pizza_zamjena = dostupne_pizze.find(p => p.naziv == naziv_pizza_zamjena);

    if (!pizza_zamjena) {
        return res.status(404).json({ greska: `Pizza s nazivom ${naziv_pizza_zamjena} ne postoji.` })
    }

    if (!same_arrays(dozvoljeni_kljucevi, nova_pizza_kljucevi)) {
        return res.status(400).json({ greska: "Kljucevi se ne podudaraju" })
    }

    let postojeci_id = pizza_zamjena.id;

    let pizza_zamjena_index = dostupne_pizze.indexOf(pizza_zamjena);

    dostupne_pizze.splice(pizza_zamjena_index, 1, { id: postojeci_id, ...nova_pizza })

    console.log(novi_zapis)
    return res.send(dostupne_pizze)
})

router.patch('/:id', (req, res) => {
    let pizza_za_patch_id = req.params.id

    if (isNaN(pizza_za_patch_id)) {
        return res.status(400).json({ greska: "ID pizze mora biti broj" })
    }

    if (!req.body) {
        return res.status(400).json({ poruka: "Poslano je prazno tijelo zahtjeva" })
    }

    // provjera: postoji li u req.body barem jedan kljuc koji je sadrzavn unutar dozvoljeni_kljucevi

    let patch_podaci = req.body;

    console.log("Patch podaci", patch_podaci);

    let patch_podaci_kljucevi = Object.keys(patch_podaci)

    if (!patch_podaci_kljucevi.every(kljuc => dozvoljeni_kljucevi.includes(kljuc))) {
        return res.status(400).json({ greska: "Poslali ste neispravne kljuceve za azuriranje" });
    }

    console.log("Patch podaci kljucevi", patch_podaci_kljucevi)

    let pizza_patch_index = dostupne_pizze.findIndex(p => p.id == pizza_za_patch_id)

    if (pizza_patch_index == -1) {
        return res.status(404).json({ greska: `Ne postoji pizza s ID-om ${pizza_za_patch_index}` })
    }

    let pizza_patch = dostupne_pizze[pizza_patch_index];

    Object.assign(pizza_patch, patch_podaci)

    // dostupne_pizze[pizza_patch_index].cijena = cijena;

    return res.status(200).json(dostupne_pizze)
})

export default router;