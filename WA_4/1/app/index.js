import express from "express";
import fs  from "fs";
import path from "path";
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storyPath = path.join(__dirname, "data", "story.txt");


let student_pero = {
  ime: "Pero",
  prezime: "Perić",
  godine: 20,
  fakultet: "FIPU",
};

async function read_story() {
    try {
        const data = await fs.readFile('data/story.txt', 'utf-8')
        return data
    } catch (error) {
        console.log('Error reading file: ', error)
        return null
    }
}

app.get("/", (req, res) => {
  res.status(200).send("Vrijeme je za citanje datoteka!");
});

app.get("/story", async (req, res) => {
    const data = await read_story()
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(500).send('Errror reading story file.')
    }
});

app.get('/write', (req, res) => {
    const data = 'Ovo je tekst koji zelimo zapisati u datoteku'
    fs.writeFile('data/write.txt', data, 'utf-8', err => {
        if (err) {
            console.err('Greska prilikom pohrane u datoteku: ', err)
            res.status(500).send('Greska prilikom pohrane u datoteku')
        } else {
            console.log('Podaci su uspjesno zapisani u datoteku')
            res.status(200).send('Podaci su uspjesno zapisani u datoteku')
        }
    })
})

app.get('/write-callback', (req, res) => {
    const string = 'Ovo je tekst koji smo pohranili asinkrono u datoteku kroz Callback patten i w flag'
    fs.writeFile('data/text.txt', string, {encoding: 'utf-8', flag: 'w'}, err => {
        if (err) {
            console.err('Greska prilikom pohrane u datoteku: ', err)
            res.status(500).send('Greska prilimom pohrane u datoteku.')
        } else {
            console.log('Podaci uspjesno pohranjeni u datoteku')
            res.status(200).send('Podaci uspjesno pohranjeni u datoteku')
        }
    })
})

app.get('/write-json-callback', (req, res) => {
    fs.writeFile('data/data.json', JSON.stringify(student_pero), err => {
        if (err) {
            console.err('Greska prilikom pohrane u datoteku: ', err)
            res.status(500).send('Greska prilikom pohrane u datoteku.')
        } else {
            console.log('Podaci uspjesno zapisani u datoteku.')
            res.status(200).send('Podaci uspjeno zapisani u datoteku')
        }
    })
})




app.listen(3000, () => {
  console.log("Posluzitelj radi na portu 3000");
});
