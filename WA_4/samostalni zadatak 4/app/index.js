import express from "express";
import fs from "fs/promises";
import { get } from "http";
import { type } from "os";
import path from "path";

const app = express();
app.use(express.json());

const DATA_FILE = path.join(path.resolve(), "data", "zaposlenici.json");

async function getZaposlenici() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Doslo je do greske pri citanju datoteke: ", error);
    return [];
  }
}

app.get("/zaposlenici", async (req, res) => {
  try {
    let zaposlenici = await getZaposlenici();

    const {
      pozicija,
      godine_staza_min,
      godine_staza_max,
      sortiraj_po_godinama,
    } = req.query;

    if (pozicija) {
      zaposlenici = zaposlenici.filter(
        (z) => z.pozicija.toLowerCase() === pozicija.toLowerCase()
      );
    }

    if (godine_staza_min) {
      zaposlenici = zaposlenici.filter(
        (z) => z.godine_staza >= parseInt(godine_staza_min)
      );
    }

    if (godine_staza_max) {
      zaposlenici = zaposlenici.filter(
        (z) => z.godine_staza <= parseInt(godine_staza_max)
      );
    }

    if (sortiraj_po_godinama) {
        if (sortiraj_po_godinama === 'uzlazno') {
            zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza)
        } else if (sortiraj_po_godinama === 'silazno') {
            zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza)
        }
    }

    res.status(200).send(zaposlenici)

  } catch (error) {
    console.error("Greska pri citanju podataka: ", error);
    res.status(500).send('Greska pri citanju podataka')
  }
});

app.get('/zaposlenici/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        return res.status(400).send('ID mora biti broj.')
    }

    try {
        const zaposlenici = await getZaposlenici()
        const zaposlenik = zaposlenici.find(z => z.id === id)

        if (!zaposlenik) {
            return res.status(404).send('Zaposlenik nije pronaden')
        }

        res.status(200).send(zaposlenik)
    } catch (error) {
        res.status(500).send('Greska na serveru: ', error)
    }
})

app.post('/zaposlenici', async (req, res) => {
    const noviZaposlenik = req.body

    if (!noviZaposlenik.ime ||!noviZaposlenik.prezime || !noviZaposlenik.godine_staza || !noviZaposlenik.pozicija) {
        return res.status(400).send('Nedostaju podaci (ime, prezime, godine staza, pozicija)')
    }

    if (typeof noviZaposlenik.ime !== 'string' || typeof noviZaposlenik.prezime !== 'string' || typeof noviZaposlenik.pozicija !== 'string') {
        return res.status(400).send('ime, prezime i pozicija moraju biti tekst (string)')
    }

    if (typeof noviZaposlenik.godine_staza !== 'number') {
        return res.status(400).send('godine staza moraju biti broj')
    }

    try {
        const zaposlenici = await getZaposlenici()

        const id = zaposlenici.length > 0 ? Math.max(...zaposlenici.map(z => z.id)) + 1 : 1

        const zaposlenikZaSpremanje = {
            id: id,
            ...noviZaposlenik
        }

        zaposlenici.push(zaposlenikZaSpremanje)

        await fs.writeFile(DATA_FILE, JSON.stringify(zaposlenici, null, 2))
        
        res.status(201).json(zaposlenikZaSpremanje)
    } catch (error) {
        console.error(error)
        res.status(500).send('Greska pri spremanju zaposlenika')
    }
})




app.listen(3000, () => {
  console.log("Poslužitelj sluša na portu 3000");
});