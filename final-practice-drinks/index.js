import express from "express";
import { connectToDatabase } from "./db.js";
import drinksRouter from './routes/drinks.js'
import usersRouter from './routes/users.js'
import  {authoriseUser} from './routes/users.js'

const app = express();

app.use(express.json());
app.use('/drinks', authoriseUser, drinksRouter)
app.use('/users', usersRouter)

const db = await connectToDatabase(); // primjer korištenja asinkrone funkcije za spajanje na bazu podataka

app.get("/", (req, res) => {
  res.send("wa-final backend radi!");
});

const PORT = 3000; // pripazite da je port slobodan, ako nije, promijenite ga

app.listen(PORT, (error) => {
  if (error) {
    console.log("Greška prilikom pokretanja poslužitelja", error);
  }
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});
