import express from "express";
import { pronadiKorisnika, validacijaEmaila } from "../middleware/korisnici.js";
import { korisnici } from "../data/korisnici._data.js";


const router = express.Router();



router.get("/", async (req, res) => {
  if (korisnici) {
    return res.status(200).json(korisnici);
  }
  return res.status(404).json({ message: "Nema korisnika" });
});

// dohvat pojedinog korisnika
router.get("/:id", [pronadiKorisnika], async (req, res) => {
  return res.status(200).json(korisnik);
});

// azuriranje emaila pojedinog korisnika
router.patch(
  "/:id",
  [validacijaEmaila, pronadiKorisnika],
  async (req, res) => {
    console.log("Ulazm u route handler");

    req.korisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.korisnik);
  },
);


export default router;