import express from "express";
import { connectToDatabase } from "../db.js";
import { query, validationResult } from "express-validator";
import { findUserById } from "../middleware/middleware.js";

const router = express.Router();

router.get(
  "/",
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit mora biti pozitivan broj"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = await connectToDatabase();
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

      const cursor = db.collection("users").find();
      if (limit) cursor.limit(limit);

      const users = await cursor.toArray();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Greska pri dohvatu korisnika",
        error: error.message,
      });
    }
  },
);

router.get("/:id", findUserById, (req, res) => {
  res.status(200).json(req.user);
});

router.delete("/:id", findUserById, async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.collection("users").deleteOne({ _id: req.user._id });
    res.status(200).json({ message: "Korisnik uspjesno obrisan" });
  } catch (error) {
    res.status(500).json({
      message: "Greska pri brisanju korisnika",
      error: error.message,
    });
  }
});

export default router;
