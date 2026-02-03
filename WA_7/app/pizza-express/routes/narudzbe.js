import express from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /narudzbe - Dohvat svih narudžbi autoriziranog korisnika
router.get("/", authMiddleware, async (req, res) => {
  try {
    const narudzbe_collection = req.db.collection("narudzbe");
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Token nije valjan" });
    }

    const userFilter = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;

    const narudzbe = await narudzbe_collection
      .find({ userId: userFilter })
      .toArray();

    return res.json(narudzbe);
  } catch (error) {
    return res.status(500).json({ error: "Greška pri dohvaćanju narudžbi" });
  }
});

// POST /narudzbe - Izrada nove narudžbe pizza
router.post("/", authMiddleware, async (req, res) => {
  let narudzbe_collection = req.db.collection("narudzbe");
  let novaNarudzba = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Token nije valjan" });
  }

  // Ne vjeruj podacima iz klijenta za cijenu ili userId
  delete novaNarudzba.ukupna_cijena;
  delete novaNarudzba.userId;

  let obavezniKljucevi = ["ime", "adresa", "telefon", "narucene_pizze"];
  let obavezniKljuceviStavke = ["naziv", "količina", "veličina"];

  let pizze_collection = req.db.collection("pizze");
  let dostupne_pizze = await pizze_collection.find().toArray();

  if (!obavezniKljucevi.every((kljuc) => kljuc in novaNarudzba)) {
    return res.status(400).json({ error: "Nedostaju obavezni kljucevi" });
  }

  for (let stavka of novaNarudzba.narucene_pizze) {
    if (!obavezniKljuceviStavke.every((kljuc) => kljuc in stavka)) {
      return res
        .status(400)
        .json({ error: "Nedostaju obavezni kljcuevi u stavci narudzbe." });
    }
  }

  if (
    !novaNarudzba.narucene_pizze.every((stavka) => {
      return (
        Number.isInteger(stavka.količina) &&
        stavka.količina > 0 &&
        ["mala", "srednja", "jumbo"].includes(stavka.veličina)
      );
    })
  ) {
    return res
      .status(400)
      .json({ error: "Neispravni podaci u stavci narudzbe." });
  }

  if (
    !novaNarudzba.narucene_pizze.every((stavka) =>
      dostupne_pizze.some((pizza) => pizza.naziv === stavka.naziv)
    )
  ) {
    return res
      .status(404)
      .json({ error: "Odabrali ste pizzu koju nemamo u ponudi" });
  }

  // izracun ukupne cijene: ukupna_cijena
  let ukupna_cijena = 0;
  for (let stavka of novaNarudzba.narucene_pizze) {
    const pizza = dostupne_pizze.find((pizza) => pizza.naziv === stavka.naziv);

    const cijenaZaVelicinu = pizza.cijene[stavka.veličina];

    if (!cijenaZaVelicinu) {
      return res
        .status(400)
        .json({ error: `Velicina ${stavka.veličina} nije dostupna za pizzu` });
    }

    ukupna_cijena += cijenaZaVelicinu * stavka.količina; 
  }

  // dodaj ukupna_cijena u narudzbu
  novaNarudzba.ukupna_cijena = ukupna_cijena;
  novaNarudzba.userId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
  novaNarudzba.createdAt = new Date();

  try {
    let result = await narudzbe_collection.insertOne(novaNarudzba);
    res
      .status(201)
      .json({ insertedId: result.insertedId, ukupna_cijena: ukupna_cijena });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

export default router;
