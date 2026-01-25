import express from "express";
import moviesRouter from "./routes/movies.js";
import actorsRouter from "./routes/actors.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(logger);

app.use("/movies", moviesRouter);
app.use("/actors", actorsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Došlo je do pogreške na poslužitelju!");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška: ${error.message}`);
  } else {
    console.log(`Poslužitelj radi na http://localhost:${PORT}`);
  }
});