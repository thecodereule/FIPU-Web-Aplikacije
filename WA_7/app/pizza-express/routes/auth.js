import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Korisničko ime i lozinka su obavezni" });
    }

    const db = req.db;
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Neispravno korisničko ime ili lozinka" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Neispravno korisničko ime ili lozinka" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Uspješna prijava",
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);  
    res.status(500).json({ error: "Greška pri prijavi" });
  }
});

export default router;