import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
    const { posiljatelj } = req.query

    if (!posiljatelj) {
        return res.status(200).json((poruke))
    }

    if (typeof posiljatelj !== 'string') {
        return res.status(400).json({
            message: 'Parametar posaljitelj mora biti string'
        })
    }

    const filtriranePorukePoPosaljitelju = poruke.filter(p => p.posiljatelj === posiljatelj);

    if (filtriranePorukePoPosaljitelju.length === 0) {
        return res.status(404).json({
            message: `Nema poruka od posaljitelja: ${posiljatelj}`
        })
    }

    res.status(200).json(filtriranePorukePoPosaljitelju)
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Neispravan ID",
            id: req.params.id
        });
    }

    const poruka = poruke.find(p => p.id === id);

    if (!poruka) {
        return res.status(404).json({
            message: "Poruka s trazenim ID-om ne postoji",
            id: id
        })
    }

    res.status(200).json(poruka)
})

router.post('/', (req, res) => {
    const { posiljatelj, sadrzaj, id } = req.body;

    if (id !== undefined) {
        return res.status(400).json({
            message: "ID se ne smije poslati u tijelu zahtjeva"
        });
    }

    if (!posiljatelj || !sadrzaj) {
        res.status(400).json({
            message: "Neispravni podaci"
        })
    }

    const novId = poruke.length + 1;

    const novaPoruka = {
        id: novId,
        posiljatelj,
        sadrzaj
    };

    poruke.push(novaPoruka);

    res.status(201).json(novaPoruka)
})

export default router;