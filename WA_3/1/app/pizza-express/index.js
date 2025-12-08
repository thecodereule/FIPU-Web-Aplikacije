import express from 'express'
import pizzeRouter from './routes/pizze.js'
import narudzbeRouter from './routes/narudzbe.js';



const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/pizze', pizzeRouter)
app.use('/narudzbe', narudzbeRouter); 

app.get('/', (req ,res) => {
    res.send('Dobrodosli u Pizza Express posluzitelj!');
}) 

app.listen(PORT, () => {
    console.log(`Pizza posluzitelj slusa na portu ${PORT}`);
})

