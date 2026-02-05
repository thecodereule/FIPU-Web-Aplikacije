import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

function validateDrinkData(noviNapitak) {
  const errors = [];

  if (!noviNapitak.naziv || typeof noviNapitak.naziv !== "string") {
    errors.push("naziv je obavezan i mora biti string");
  } else if (noviNapitak.naziv.length < 3 || noviNapitak.naziv.length > 50) {
    errors.push("naziv mora imati izmedu 3 i 50 znakova");
  }

  if (
    typeof noviNapitak.zapremina !== "number" ||
    noviNapitak.zapremina < 0.1
  ) {
    errors.push("zapremina je obavezna, mora biti broj i minimalno 0.1");
  }

  if (typeof noviNapitak.cijena !== "number" || noviNapitak.cijena < 0.5) {
    errors.push("cijena je obavezna, mora biti broj i minimalno 0.5");
  }

  if (typeof noviNapitak.kolicina !== "number" || noviNapitak.cijena < 0.5) {
    errors.push("kolicina je obavezna, mora biti broj i minimalno 50");
  }

  return errors;
}

const validateDrink = (req, res, next) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Atribut 'type' je obavezan" });
  }

  if (type === "jedan") {
    const validationErrors = validateDrinkData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
  } else if (type === "polje") {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "ocekuje se niz objekata" });
    }

    for (let i = 0; i < req.body.length; i++) {
      const validationErrors = validateDrinkData(req.body[i]);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: `Objekt na indeksu ${i} nije validan`,
          errors: validationErrors,
        });
      }
    }
  } else {
    return res
      .status(400)
      .json({ errors: "Atribut 'type' mora biti 'jedan' ili 'polje" });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const napitci_collection = db.collection("drinks");

    const napitci = await napitci_collection.find({}).toArray();

    if (napitci.length === 0) {
      return res.status(404).json({ error: "Nema napitaka" });
    }

    res.status(200).json(napitci);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const napitci_collection = db.collection("drinks");

    const { id } = req.params;

    if (id.length !== 24) {
      return res.status(400).json({
        error: "Neispravan identifikator (duljina stringa razlicita od 24)",
      });
    }

    let objectId;

    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ error: "neispravan identifikator" });
    }

    const napitak = await napitci_collection.findOne({ _id: objectId });

    if (!napitak) {
      return res.status(404).json({ error: "napitak nije pronaden" });
    }

    res.status(200).json(napitak);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validateDrink, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const napitci_collection = db.collection("drinks");

    const { type } = req.query;

    if (type === "jedan") {
      const rezultat = await napitci_collection.insertOne(req.body);
      return res.status(201).json({
        message: "Napitak dodan uspjesno",
        _id: rezultat.insertedId,
      });
    } else if (type === "polje") {
      const rezultat = await napitci_collection.insertMany(req.body);
      return res.status(201).json({
        message: "Napitci dodani uspjesno",
        insertedCount: rezultat.insertedCount,
        insertedIds: rezultat.insertedIds,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
