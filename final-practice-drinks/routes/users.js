import express from "express";
import { connectToDatabase } from "../db.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const router = express.Router();

const comparePassword = async (plain_text, hashed_password) => {
  try {
    const isMatch = await bcrypt.compare(plain_text, hashed_password);
    return isMatch;
  } catch (error) {
    console.error("Greska pri usporedbi lozinke: ", error);
    return false;
  }
};

const authoriseUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header nedostaje" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Token nedostaje" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "JWT_SECRET=super-secret-key",
    );

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Neispravan ili istekao token" });
  }
};

router.post(
  "/",
  body("username")
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("username mora biti string, minimalno 3 znaka, maksimalno 20"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .matches(/[a-zA-Z0-9]/)
    .withMessage(
      "password mora biti string, minimalno 8 znakova i alfanumericki",
    ),
  body("email").isEmail().withMessage("email mora biti validan email format"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = await connectToDatabase();
      const users_collection = db.collection("users");

      const { username, password, email } = req.body;

      const existingUser = await users_collection.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Korisnik s tim username-om vec postoji" });
      }

      const existingEmail = await users_collection.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email je vec registriran" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await users_collection.insertOne({
        username,
        password: hashedPassword,
        email,
        createdAt: new Date(),
      });

      res.status(201).json({
        message: "Korisni uspjesno registriran",
        _id: result.insertedId,
        username,
        email,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.post(
  "/login",
  body("username").isString().withMessage("username je obavezan"),
  body("password").isString().withMessage("password je obavezan"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = await connectToDatabase();
      const users_collection = db.collection("users");

      const { username, password } = req.body;

      const user = await users_collection.findOne({ username });
      if (!user) {
        return res
          .status(401)
          .json({ error: "korisnicko ime ili lozinka su neispravni" });
      }

      const isPasswordMatch = await comparePassword(password, user.password);
      if (!isPasswordMatch) {
        return res
            .status(401)
            .json({error: "korisnicko ime ili lozinka su neispravni"})
      }

      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
        process.env.JWT_SECRET || "super-secret-key",
        {expiresIn: "1h"}
      );

      res.status(200).json({
        message: "prijava uspjesna",
        token,
        user: {
            username: user.username,
            email: user.email,
        },
      })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
  }
)

export default router;
export { comparePassword, authoriseUser };
