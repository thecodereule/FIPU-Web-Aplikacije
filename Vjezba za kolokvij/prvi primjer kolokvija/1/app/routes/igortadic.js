import express from 'express';
const router = express.Router();

router.get("/tadic", (req, res) => {
    res.status(200).json({
        ime: "Igor",
        prezime: "Tadic",
        jmbag: "03114214210311"
    })
})
// curl -i http://localhost:3000/igor/tadic


export default router;