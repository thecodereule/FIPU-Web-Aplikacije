import { korisnici } from "../data/korisnici._data.js"; 


export const validacijaEmaila = (req, res, next) => {
  console.log("Ulazim u middleware");
  if (req.body.email && typeof req.body.email === "string") {
    return next();
  }
  console.log("Izlazim iz middlewarea");
  return res.status(400).json({ message: "neispravni podaci" });
};

export const pronadiKorisnika = (req, res, next) => {
  const id_route_param = parseInt(req.params.id);
  const korisnik = korisnici.find((korisnik) => korisnik.id === id_route_param);

  if (korisnik) {
    req.korisnik = korisnik;
    return next();
  }
  return res.status(404).json({ message: "Nema korisnika" });
};
