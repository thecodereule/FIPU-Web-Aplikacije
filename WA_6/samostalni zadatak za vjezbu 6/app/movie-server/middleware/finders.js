import { movies, actors } from "../data.js";

export const findMovie = (req, res, next) => {
  const id = parseInt(req.params.id);
  // Provjera je li ID broj (iako će validator to kasnije provjeriti, ovo je za logiku traženja)
  if (isNaN(id)) return next();

  const movie = movies.find((m) => m.id === id);
  if (!movie) {
    return res.status(404).json({ message: "Film nije pronađen" });
  }
  req.movie = movie; // Dodajemo film u request objekt [cite: 248]
  next();
};

export const findActor = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next();

  const actor = actors.find((a) => a.id === id);
  if (!actor) {
    return res.status(404).json({ message: "Glumac nije pronađen" });
  }
  req.actor = actor; // Dodajemo glumca u request objekt
  next();
};
