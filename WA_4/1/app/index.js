import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storyPath = path.join(__dirname, "data", "story.txt");


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



app.listen(3000, () => {
  console.log("Posluzitelj radi na portu 3000");
});
