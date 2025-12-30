import express from "express";

const router = express.Router();


router.get("/", async (req, res) => {
  const pizze_collection = req.db.collection("pizze");

  // svi moguci query parametri
  const { naziv, cijena_min, cijena_max, sort } = req.query;

  try {
    const filter = {};

    // 1. pretrazivanje po nazivu (djelomicno podudaranje, case-insensitive) 
    if (naziv) {
      filter.naziv = { $regex: naziv, $options: "i" };
    }

    // 2. Filtriranje po cijeni
    // cijena je objekt pa me zanima upada li BILO KOJA velicina u raspon.
    if (cijena_min || cijena_max) {
      const criteria = {};

      if (cijena_min) criteria.$gte = parseFloat(cijena_min);
      if (cijena_max) criteria.$lte = parseFloat(cijena_max);

      // $or provjerava sve tri veličine.
      filter.$or = [
        { "cijene.mala": criteria },
        { "cijene.srednja": criteria },
        { "cijene.jumbo": criteria },
      ];
    }

    // Sortiranje
    const sortOptions = {};
    if (sort) {
      const direction = sort === "desc" ? -1 : 1;
      sortOptions["cijene.mala"] = direction;
    }

    // Dohvaćanje podataka s filterom i sortiranjem
    const pizze = await pizze_collection
      .find(filter)
      .sort(sortOptions)
      .toArray();

    res.status(200).json(pizze);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// PUT ruta za zamjenu cijelog jelovnika
router.put("/", async (req, res) => {
  let pizze_collection = req.db.collection("pizze");
  let noviMeni = req.body;

  try {
    await pizze_collection.deleteMany({});
    let result = await pizze_collection.insertMany(noviMeni);
    res.status(200).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).send({ error: errorResponse });
  }
});

// POST ruta za dodavanje nove pizze
router.post("/", async (req, res) => {
  let pizze_collection = req.db.collection("pizze");
  let novaPizza = req.body;

  const obavezniKljucevi = ["naziv", "sastojci", "cijena", "slika_url"];
  const kljuceviTijela = Object.keys(novaPizza);

  const sviPrisutni = obavezniKljucevi.every((kljuc) =>
    kljuceviTijela.includes(kljuc)
  );
  const nemaExtra = kljuceviTijela.every((kljuc) =>
    obavezniKljucevi.includes(kljuc)
  );

  if (!sviPrisutni || !nemaExtra) {
    return res.status(400).json({
      error:
        "Neispravan format podataka. Potrebni kljucevi su: naziv, sastojci, cijena, slika_url",
    });
  }

  if (typeof novaPizza.cijena !== "number") {
    return res.status(400).json({ error: "Polje 'ccijena' mora biti broj." });
  }

  if (
    !Array.isArray(novaPizza.sastojci) ||
    novaPizza.sastojci.every((sastojak) => typeof sastojak === "string")
  ) {
    return res
      .status(400)
      .json({ greska: "Polje 'sastojci' mora biti niz stringova" });
  }

  try {
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).json(result.insertedId);
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

export default router;
