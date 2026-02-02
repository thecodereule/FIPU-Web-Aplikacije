import express from "express";
import pizzeRouter from "./routes/pizze.js";
import { pizze } from "./data/data.js";
import narudzbeRouter from "./routes/narudzbe.js";
import cors from "cors";
import { connectToDatabase } from "./db.js";
import { ObjectId } from "mongodb";
import authRouter from "./routes/auth.js"

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cors(corsOptions));

let db = await connectToDatabase();

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/pizze", pizzeRouter);
app.use("/narudzbe", narudzbeRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Dobrodošli u Pizza Express poslužitelj!");
});

app.listen(PORT, () => {
  console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
