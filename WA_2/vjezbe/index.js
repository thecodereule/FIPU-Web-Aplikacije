import express from 'express';
import users from './users.js';
import pizze from './routes/pizze.js';
import { fileURLtoPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLtoPath(import.meta.url));

const app = express();
app.use(express.json())

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



app.post('/naruci', (req, res) => {
    const { narudzba, klijent } = req.body;

    // Provjera jesu li svi potrebni podaci poslani
    if (!narudzba || !klijent || !klijent.prezime || !klijent.adresa || !klijent.broj_telefona) {
        return res.json({ message: 'Niste poslali sve potrebne podatke za narudzbu' });
    }

    if (!Array.isArray(narudzba)) {
        res.send('Narudzba mora biti niz objekata');
        return;
    }

    for (let stavka of narudzba) {
        const kljucevi = Object.keys(stavka);

        if (!(kljucevi.includes('pizza') && kljucevi.includes('velicina') && kljucevi.includes('kolicina'))) {
            res.send('Niste poslali sve potrebne podatke za stavku narudzbe');
            return;
        }

        const pizza = pizze.find(p => p.naziv === stavka.pizza);
        if (!pizza) {
            return res.send(`Pizza ${stavka.pizza} ne postoji u jelovniku`);
        }
    }

    let ukupna_cijena = 0;
    const pizza_nazivi = [];

    for (let stavka of narudzba) {
        const pizza = pizze.find(p => p.naziv === stavka.pizza);
        const cijena = pizza.cijene[stavka.velicina];
        ukupna_cijena += cijena * stavka.kolicina;
        pizza_nazivi.push(`${stavka.pizza}_${stavka.velicina}`);
    }

    const novaNarudzba = {
        narudzba: narudzba,
        klijent: klijent,
        ukupna_cijena: ukupna_cijena
    };

    narudzbe.push(novaNarudzba);

    console.log('Primljeni podaci: ', req.body);

    res.json({
        message: `Vaša narudžba za ${pizza_nazivi.join(' i ')} je uspješno zaprimljena!`,
        klijent: klijent,
        ukupna_cijena: ukupna_cijena
    });
});

app.put('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;
    const nova_pizza = req.body;
    nova_pizza.id = id_pizza;

    const index = pizze.findIndex(pizza => pizza.id == id_pizza);

    if (index !== -1) {
        pizze[index] = nova_pizza;
        res.json(pizze[index]);
    } else {
        res.json({ message: 'Pizza s trazenim ID-om ne postoji' });
    }
});

app.patch('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;
    const nova_pizza = req.body;

    const index = pizze.findIndex(pizza => pizza.id === id_pizza);

    if (index !== -1) {
        for (const key in nova_pizza) {
            pizze[index][key] = nova_pizza[key];
        }
        res.json(pizze[index]);
    } else {
        res.json({message: 'Pizza s trazenim ID-om ne postoji.'})
    }
})

app.delete('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;

    const index = pizze.findIndex(pizza => pizza.id === id_pizza);

    if (index !== -1) {
        pizze.splice(index, 1);
        res.json({message: 'Pizza uspjesno obrisana.'})
    } else {
        res.json({message: 'Pizza s trazenim ID-om ne postoji.'})
    }
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    }
    else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});

