import express from "express";
import { connectToDatabase } from "./db.js";
import { ObjectId } from "mongodb";

const app = express();
const PORT = 3000;

let db = await connectToDatabase();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pizza app");
});

app.get("/pizze", async (req, res) => {
  const pizze_collection = db.collection("pizze");
  const { cijena, cijena_min, cijena_max } = req.query;

  try {
    let filter = {};

    if (cijena) {
      // točna cijena
      filter.cijena = Number(cijena);
    } else {
      // raspon
      if (cijena_min) filter.cijena = { $gte: Number(cijena_min) };
      if (cijena_max) {
        filter.cijena = filter.cijena
          ? { ...filter.cijena, $lte: Number(cijena_max) }
          : { $lte: Number(cijena_max) };
      }
    }

    const pizze = await pizze_collection.find(filter).toArray();
    res.status(200).json(pizze);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/pizze/:naziv", async (req, res) => {
  let pizze_collection = db.collection("pizze");
  let naziv_param = req.params.naziv;
  let pizza = await pizze_collection.findOne({ naziv: naziv_param });
  res.status(200).json(pizza);
});

app.get("/pizze/:id", (req, res) => {
  const id = req.params.id;
  const pizza = pizze.find((pizza) => pizza.id === id);
  res.status(200).json(pizza);
});

app.post("/pizze", async (req, res) => {
  let pizze_collection = db.collection("pizze");
  let novaPizza = req.body;
  try {
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).json(result.insertedId);
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.patch("/pizze/:naziv", async (req, res) => {
  let pizze_collection = db.collection("pizze");
  let naziv_param = req.params.naziv;
  let novaCijena = req.body.cijena;

  try {
    let result = await pizze_collection.updateOne(
      { naziv: naziv_param },
      { $set: { cijena: novaCijena } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ greska: "Pizza nije pronadena" });
    }

    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(400).json({ greska: error.errorResponse });
  }
});

app.put("/pizze", async (req, res) => {
  let pizze_collection = db.collection("pizze");
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

app.patch('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze')

  try {
    let result = await pizze_collection.updateMany({cijena: {$lt: 15}}, {$inc: {cijena: 2}})
    res.status(200).json({modifiedCount: result.modifiedCount})
  } catch (error) {
    console.log(error.errorResponse)
    res.status(400).json({error: error.errorResponse})
  }
})

app.delete("/pizze/:naziv", async (req, res) => {
  let pizze_collection = db.collection("pizze");
  let naziv_param = req.params.naziv;

  try {
    let result = await pizze_collection.deleteOne({ naziv: naziv_param });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.delete("/pizze", async (req, res) => {
  let pizze_collection = db.collection("pizze");

  try {
    let result = await pizze_collection.deleteMany({});
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.get("/narudzbe", async (req, res) => {
  let narudzbe_collection = db.collection("narudzbe");
  let narudzbe = await narudzbe_collection.find().toArray();

  if (narudzbe.length === 0) {
    return res.status(404).json({ error: "Nema narudzbi" });
  }

  res.status(200).json(narudzbe);
});

app.get("/narudzbe/:id", async (req, res) => {
  let narudzbe_collection = db.collection("narudzbe");
  let id_param = req.params.id;
  let narudzba = await narudzbe_collection.findOne({
    _id: new ObjectId(id_param),
  });

  if (!narudzba) {
    return res.status(404).json({ error: "Narudzba nije pronadena" });
  }

  res.status(200).json(narudzba);
});

app.patch("/narudzbe/:id", async (req, res) => {
  let narudzbe_collection = db.collection("narudzbe");
  let id_param = req.params.id;
  let noviStatus = req.body.status;

  try {
    let result = await narudzbe_collection.updateOne(
      { _id: new ObjectId(id_param) },
      { $set: { status: noviStatus } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Narudžba nije pronađena" });
    }
    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error); // za detaljniju grešku
    res.status(400).json({ error: error.message });
  }
});

app.post("/narudzbe", async (req, res) => {
  let narudzbe_collection = db.collection("narudzbe");
  let novaNarudzba = req.body;

  let obavezniKljucevi = ["kupac", "adresa", "broj_telefona", "narucene_pizze"];
  let obavezniKljuceviStavke = ["naziv", "količina", "veličina"];

  let pizze_collection = db.collection("pizze");
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
        ["mala", "srednja", "velika"].includes(stavka.veličina)
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

  try {
    let result = await narudzbe_collection.insertOne(novaNarudzba);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.get("/users", async (req, res) => {
  let users_collection = db.collection("users");
  let allUsers = await users_collection.find().toArray();
  res.status(200).json(allUsers);
});

app.get("/users", async (req, res) => {
  let users_collection = db.collection("users"); // pohranjujemo referencu na kolekciju
  let allUsers = await users_collection.find().toArray(); // dohvaćamo sve korisnike iz kolekcije i pretvaramo FindCursor objekt u JavaScript polje
  res.status(200).json(allUsers);
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Greška prilikom pokretanja servera", error);
  }
  console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});
