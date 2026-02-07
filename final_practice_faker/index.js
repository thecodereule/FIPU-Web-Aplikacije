import express from "express";
import fakeRoutes from "./routes/fake.js";
import usersRoutes from "./routes/users.js";
import { faker } from "@faker-js/faker";
import { connectToDatabase } from "./db.js";
import { logger } from "./middleware/middleware.js";

const app = express();

app.use(express.json());
app.use(logger)
app.use(express.json())
app.use("/api/fake", fakeRoutes);
app.use("/api/users", usersRoutes);

const db = await connectToDatabase(); // primjer korištenja asinkrone funkcije za spajanje na bazu podataka

const count = await db.collection("users").countDocuments();
if (count < 10) {
  const users = Array.from({ length: 10 }, () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  }));
  await db.collection("users").insertMany(users)
}

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
