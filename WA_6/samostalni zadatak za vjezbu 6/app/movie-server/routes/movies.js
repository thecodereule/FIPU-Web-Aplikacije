import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { movies } from "../data.js";
import { findMovie } from "../middleware/finders.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 1. GET /movies (s query parametrima min_year i max_year) [cite: 1025]
router.get(
  "/",
  [
    query("min_year")
      .optional()
      .isInt()
      .withMessage("min_year mora biti integer")
      .escape(), // XSS zaštita
    query("max_year")
      .optional()
      .isInt()
      .withMessage("max_year mora biti integer")
      .escape(),
    // Custom validator za raspon
    query().custom((value, { req }) => {
      const min = req.query.min_year;
      const max = req.query.max_year;
      if (min && max && parseInt(min) >= parseInt(max)) {
        throw new Error("min_year mora biti manji od max_year");
      }
      return true;
    }),
    validate,
  ],
  (req, res) => {
    let result = movies;
    const { min_year, max_year } = req.query;

    if (min_year) result = result.filter((m) => m.year >= parseInt(min_year));
    if (max_year) result = result.filter((m) => m.year <= parseInt(max_year));

    res.status(200).json(result);
  },
);

router.get(
  "/:id",
  [
    param("id").isInt().withMessage("ID mora biti integer").escape(),
    validate,
    findMovie, // Middleware za traženje [cite: 271]
  ],
  (req, res) => {
    res.status(200).json(req.movie);
  },
);

router.post(
  "/",
  [
    body("title").notEmpty().trim().escape().withMessage("Naslov je obavezan"),
    body("year").isInt().withMessage("Godina mora biti broj").escape(),
    body("genre").notEmpty().trim().escape().withMessage("Žanr je obavezan"),
    body("director")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Redatelj je obavezan"),
    validate,
  ],
  (req, res) => {
    const newMovie = {
      id: Date.now(), // Generiranje ID-a
      ...req.body,
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
  },
);

router.patch(
  "/:id",
  [
    param("id").isInt().escape(),
    findMovie, // Prvo nađemo film
    // Validacija polja ako su poslana (optional)
    body("title").optional().trim().escape(),
    body("year").optional().isInt().escape(),
    body("genre").optional().trim().escape(),
    body("director").optional().trim().escape(),
    validate,
  ],
  (req, res) => {
    const movie = req.movie; // Dobiveno iz findMovie middlewarea

    if (req.body.title) movie.title = req.body.title;
    if (req.body.year) movie.year = req.body.year;
    if (req.body.genre) movie.genre = req.body.genre;
    if (req.body.director) movie.director = req.body.director;

    res.status(200).json(movie);
  },
);

export default router;