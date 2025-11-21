import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const poruke = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/poruke.json'), 'utf-8')
)

router.get('/', (req, res) => {
    const { posiljatelj } = req.query;

    if (!posiljatelj) {
        return res.status(200).json(poruke)
    }

    if (typeof posiljatelj !== 'string') {
        return res.status(400).json({ greska: "posiljatelj mora biti string" })
    }

    const filtriranePorukePoPosiljatelju = poruke.filter(p => p.posiljatelj === posiljatelj);

    if (filtriranePorukePoPosiljatelju.length === 0) {
        return res.status(404).json({ greska: `Poruke od posiljatelja ${posiljatelj} ne postoje.` })
    }

    res.status(200).json(filtriranePorukePoPosiljatelju)
})

router.get('/:id', (req, res) => {
    const poruka_id = parseInt(req.params.id);

    if (isNaN(poruka_id)) {
        return res.status(400).json({
            message: "neispravan ID"
        })
    }

    const poruka = poruke.find(p => p.id === poruka_id);

    if (!poruka) {
        return res.status(404).json({ message: `Poruka s id-om ${poruka_id} ne postoji` })
    }

    res.status(200).json(poruka);
})

router.post('/', (req, res) => {
    const { id, posiljatelj, sadrzaj } = req.body;

    if (id !== undefined) {
        return res.status(400).json({ greska: "ID se ne smije slati u tijelu zahtjeva" });
    }

    if (!posiljatelj || !sadrzaj) {
        return res.status(400).json({ greska: "neispravni podaci" });
    }

    const novi_id = poruke.length + 1;

    const novaPoruka = {
        id: novi_id,
        posiljatelj: posiljatelj,
        sadrzaj: sadrzaj,
        created_at: new Date().toISOString()
    }

    poruke.push(novaPoruka);

    fs.writeFileSync(
        path.join(__dirname, '../data/poruke.json'),
        JSON.stringify(poruke, null, 2),
        'utf-8'
    );

    res.status(201).json(novaPoruka);
})



export default router;