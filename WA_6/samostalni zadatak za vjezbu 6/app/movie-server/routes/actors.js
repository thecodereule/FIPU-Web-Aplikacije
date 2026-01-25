import express from "express";
import { body, param, validationResult } from "express-validator";
import { actors } from "../data.js";
import { findActor } from "../middleware/finders.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", (req, res) => {
  res.status(200).json(actors);
});

router.get(
  "/name/:name",
  [
    param("name").isString().trim().escape(), // Sanitizacija
    validate,
  ],
  (req, res) => {
    const name = req.params.name;
    const foundActors = actors.filter((a) =>
      a.name.toLowerCase().includes(name.toLowerCase()),
    );
    res.status(200).json(foundActors);
  },
);

router.get(
  "/:id",
  [
    param("id").isInt().withMessage("ID mora biti integer").escape(),
    validate,
    findActor,
  ],
  (req, res) => {
    res.status(200).json(req.actor);
  },
);

router.post(
  "/",
  [
    body("name").notEmpty().trim().escape().withMessage("Ime je obavezno"),
    body("birthYear")
      .isInt()
      .withMessage("Godina rođenja mora biti broj")
      .escape(),
    validate,
  ],
  (req, res) => {
    const newActor = {
      id: Date.now(),
      movies: [], // Defaultno prazno polje
      ...req.body,
    };
    actors.push(newActor);
    res.status(201).json(newActor);
  },
);

router.patch(
  "/:id",
  [
    param("id").isInt().escape(),
    findActor,
    body("name").optional().trim().escape(),
    body("birthYear").optional().isInt().escape(),
    validate,
  ],
  (req, res) => {
    const actor = req.actor;

    if (req.body.name) actor.name = req.body.name;
    if (req.body.birthYear) actor.birthYear = req.body.birthYear;

    res.status(200).json(actor);
  },
);

export default router;