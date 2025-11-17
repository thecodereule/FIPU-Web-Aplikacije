import express from 'express';
import igorRouter from './routes/igortadic.js'
import porukeRouter from './routes/poruke.js'

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/igor', igorRouter);
app.use('/poruke', porukeRouter);

app.listen(PORT, () => {
    console.log("wa-mid-A poslužitelj sluša na portu 3000")
})