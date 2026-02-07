import express from "express";
import { faker } from "@faker-js/faker";
import { connectToDatabase } from "../db.js";


const router = express.Router();

function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

router.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const newUser = createRandomUser();

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      ...newUser,
      _id: result.insertedId,
    });
  } catch (error) {
    res.status(400).json({
      message: "Greska pri dodavanju fake korisnika",
      error: error.message,
    });
  }
});

export default router;
