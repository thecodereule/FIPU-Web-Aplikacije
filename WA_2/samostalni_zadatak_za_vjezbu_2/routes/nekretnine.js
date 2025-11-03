import express from 'express';
const router = express.Router();

// in-memory podaci za nekretnine 
let nekretnine = [
    {
        "id": 1,
        "naziv": "Stan u centru",
        "opis": "Moderan stan na glavnom trgu.",
        "cijena": 250000,
        "lokacija": "Zagreb, Centar",
        "broj_soba": 3,
        "povrsina": 75
    },
    {
        "id": 2,
        "naziv": "Kuća s pogledom",
        "opis": "Prostrana kuća s pogledom na more.",
        "cijena": 450000,
        "lokacija": "Split, Marjan",
        "broj_soba": 5,
        "povrsina": 180
    }
];

let nextNekreninaId = 3;

const validateNekretnina = (req, res, next) => {
    const { naziv, opis, cijena, lokacija, broj_soba, povrsina } = req.body;
    if (!naziv || !opis || cijena == null || !lokacija || broj_soba == null || povrsina == null) {
        return res.status(400).json({ message: "Svi podaci su obavezni (naziv, opis, cijena, lokacija, broj_soba, povrsina)." });
    }
    if (cijena <= 0 || broj_soba <= 0 || povrsina <= 0) {
        return res.status(400).json({ message: "Cijena, broj soba i povrsina moraju biti pozitivne vrijednosti." });
    }
    next();
};

router.get('/', (req, res) => {
    res.status(200).json(nekretnine);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "ID mora biti broj." });
    }
    const nekretnina = nekretnine.find(n => n.id === id);
    if (!nekretnina) {
        return res.status(404).json({ message: "Nekretnina nije pronađena." });
    }
    res.status(200).json(nekretnina);
});

router.post('/', validateNekretnina, (req, res) => {
    const novaNekretnina = {
        id: nextNekreninaId++,
        ...req.body
    };
    nekretnine.push(novaNekretnina);
    res.status(201).json(novaNekretnina);
});

router.put('/:id', validateNekretnina, (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "ID mora biti broj." });
    }
    const index = nekretnine.findIndex(n => n.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Nekretnina nije pronadena." });
    }
    const azuriranaNekretnina = { id: id, ...req.body };
    nekretnine[index] = azuriranaNekretnina;
    res.status(200).json(azuriranaNekretnina);
});

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({message: "ID mora biti broj."});
    }
    const index = nekretnine.findIndex(n => n.id === id);
    if (index === -1) {
        return res.status(404).json({message: "Nekretnina nije pronadena."});
    }
    if (req.body.cijena !== undefined && req.body.cijena <= 0) {
        return res.status(400).json({message: "Cijena mora biti pozitivan broj."});
    }
    if (req.body.broj_soba !== undefined && req.body.broj_soba <= 0) {
        return res.status(400).json({message: "Broj soba mora biti pozitivan broj."});
    }

    const original = nekretnine[index];
    const azurirana = { ...original, ...req.body };
    nekretnine[index] = azurirana;
    res.status(200).json(azurirana);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({message: "ID mora biti broj."});
    }
    const index = nekretnine.findIndex(n => n.id === id);
    if (index === -1) {
        return res.status(404).json({message: "Nekretnina nije pronadena."});
    }
    nekretnine.splice(index, 1);
    res.status(204).send();
})

export default router;
export { nekretnine };
