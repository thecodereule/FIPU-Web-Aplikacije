import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Korisničko ime i lozinka su obavezni" });
    }

    const db = req.db;
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Korisničko ime je već zauzeto" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Korisnik uspješno registriran",
      userId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Greška pri registraciji" });
  }
});

export default router;
