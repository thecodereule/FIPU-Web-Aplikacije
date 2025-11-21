import express from 'express';
import path from 'path';


import pizze_router from "./routes/pizze.js"
import narudzbe_router from "./routes/narudzbe.js"

const app = express();
const PORT = 3000;

app.use(express.json())
app.use('/pizze', pizze_router)
app.use("/narudzbe", narudzbe_router)


app.get('/', (req, res) => {
    // res.json({poruka: "pozdrav s defaultne rute"})
    let putanja = path.join("static", "index.html");
    let aps_putanja = path.resolve(putanja);
    console.log(aps_putanja)
    res.sendFile(aps_putanja)
})



app.listen(PORT, (error) => {
    if (error) {
        console.log("Greska pri pokretanju posluzitelja");
    }
    console.log(`Posluzitelj slusa na portu ${PORT}`);
})