import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;


app.use(express.json())

let dostupne_pizze = [
    { id: 1, naziv: 'Margherita', cijena: 6.5 },
    { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
    { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
    { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
    { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
]

app.get('/', (req, res) => {
    // res.json({poruka: "pozdrav s defaultne rute"})
    let putanja = path.join("static", "index.html");
    let aps_putanja = path.resolve(putanja);
    console.log(aps_putanja)
    res.sendFile(aps_putanja)
})

app.get('/pizze', (req, res) => {
    res.json(dostupne_pizze)
})

app.get('/pizze/:naziv', (req, res) => {
    let naziv_pizze = req.params.naziv;

    let trazena_pizza = dostupne_pizze.find(p => p.naziv === naziv_pizze)
    
    if (trazena_pizza) {
        return res.json(trazena_pizza);
    }
    return res.json({poruka: "Ne postoji trazena pizza"})
})

app.post('/pizze', (req, res) => {
    let pizza_dodavanje = req.body

    if (!req.body) 
    {
        return res.json({greska: "http body je prazan"})
    }

    let postojeca = dostupne_pizze.find(p => p.naziv === pizza_dodavanje.naziv);
    if (postojeca) {
        res.json({greska: `Pizza s nazivom ${postojeca.naziv} vec postoji`})
    }

    const novi_id = dostupne_pizze.at(-1)['id'] + 1;

    dostupne_pizze.push({id: novi_id, ...pizza_dodavanje})
    res.json(dostupne_pizze);
})

app.delete('/pizze/:naziv', (req, res) => {
    let naziv_brisanje = req.params.naziv
    let pizza_za_brisanje = dostupne_pizze.findIndex(p => p.naziv === naziv_brisanje);

    if (pizza_za_brisanje != -1) {
        console.log("Pronasao sam pizzu za brisanje")
        dostupne_pizze.splice(pizza_za_brisanje, 1)
        return res.json(dostupne_pizze)
    } else {
        return res.json({poruka: "Ne mogu pronaci pizzu"})
    }
})

app.listen(PORT, (error) => {
    if (error) {
        console.log("Greska pri pokretanju posluzitelja");
    }
    console.log(`Posluzitelj sluza na portu ${PORT}`);
})