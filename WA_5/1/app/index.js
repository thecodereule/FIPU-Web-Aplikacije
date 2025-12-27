import express from "express";
import { connectToDatabase } from "./db.js";

const app = express();
const PORT = 3000;

let db = await connectToDatabase();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pizza app");
});

app.get("/pizze", async (req, res) => {
  let pizze_collection = db.collection("pizze");
  let allPizze = await pizze_collection.find().toArray();
  res.status(200).json(allPizze);
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
    res.status(400).json({error: error.errorResponse})
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
