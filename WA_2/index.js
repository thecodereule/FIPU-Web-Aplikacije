const express = require('express');
const app = express();
app.use(express.json())

const users = require('./users')
const pizze = require('./pizze')

let narudzbe = [];

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/pizze', (req, res) => {
    res.json(pizze)
})

app.get('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;

    if (isNaN(id_pizza)) {
        res.json({ message: 'Prosljedili se parametar id koji nije broj' });
    }

    const pizza = pizze.find(pizza => pizza.id == id_pizza)
    if (pizza) {
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s trazenim ID-om ne postoji' });
    }
});

app.post('/naruci', (req, res) => {
    const narudzbe_zahtjev = req.body;

    if (!Array.isArray(narudzbe_zahtjev)) {
        res.send('Podaci moraju biti niz objekata');
        return;
    }

    for (let narudzba of narudzbe_zahtjev) {
        const kljucevi = Object.keys(narudzba);

        if (!kljucevi.includes('pizza') && kljucevi.includes('velicina') && kljucevi.includes('kolicina')) {
            res.send('Niste poslali sve potrebne podatke za nardzbu')
            return;
        }

        const pizza = pizze.find(p => p.naziv === narudzba.pizza);
        if (!pizza) {
            res.send(`Pizza ${narudzba.pizza} ne postoji u jelovniku`)
            return
        }
    }

    for (let narudzba of narudzbe_zahtjev) {
        narudzbe.push(narudzba)
    }

    console.log('Primljeni podaci: ', narudzbe_zahtjev)
    res.send(`Uspješno zaprimljena narudžba za ${narudzbe_zahtjev.length} pizze.`);
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    }
    else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});

