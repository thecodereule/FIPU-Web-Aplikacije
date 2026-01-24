import express from "express";
import korisniciRouter from "./routes/korisnici.js"


const app = express();

const timer_middleware = (req, res, next) => {
  console.log(`Trenutno vrijeme je ${new Date().toLocaleString()}`);
  next();
};

const requestLogger = (req, res, next) => {
  const date = new Date().toLocaleString();
  const method = req.method; // HTTP metoda
  const url = req.originalUrl; // URL zahtjeva
  console.log(`[${date}] : ${method} ${url}`);
  next();
};


app.use(timer_middleware);
app.use(requestLogger);
app.use(express.json());
app.use('/korisnici', korisniciRouter)

let PORT = 3000;


app.get("/", (req, res) => {
  res.status(200).send("Root endpoint posluzitelja");
});




app.listen(PORT, (error) => {
  if (error) {
    console.log(`Greska prilikom pokretanja servera: ${error.message}`);
  } else {
    console.log(`Server pokrenut na portu: ${PORT}`);
  }
});
