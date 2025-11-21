import express from 'express';

const router = express.Router();

router.get('/igor/tadic', (req, res) => {
    res.status(200).json({
        ime: "Igor",
        prezime: "Tadic",
        jmbag: "201845812"
    })
})
// curl http://localhost:3000/igor/tadic


export default router;