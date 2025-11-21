import express from 'express'
import { pizzaExists, checkArray } from '../utils/index.js'


const router = express.Router()

let narudzbe = [
    {
        id: 1,
        narucene_pizze: [
            { id_pizza: 1, kolicina: 2, velicina: "srednja" },
            { id_pizza: 4, kolicina: 1, velicina: "jumbo" }
        ],
        adresa_dostava: "Zagrebacka ulica 10, Pula",
        broj_telefona: "028510292"
    }
]
let dozvoljene_velicine = ["mala", "srednja", "jumbo"]


router.post('/', (req, res) => {
    let nova_narudzba = req.body
    
    if (!nova_narudzba) {
        return res.status(400).json({greska: "Poslali ste prazan req.body"})
    }

    let id_narudzba = null; 

    if (!checkArray(narudzbe)) {
        id_narudzba = 1;
    } else {
        id_narudzba = narudzbe.at(-1)["id"] + 1;
    }

    let narucene_pizze = nova_narudzba.narucene_pizze;
    
    narucene_pizze.forEach(stavka => {
        if (!pizzaExists(stavka["id_pizza"])) {
            return res.status(400).json({greska: `Narucena pizza s id ${stavka['id_pizza']} ne postoji`})
        }

        if (!dozvoljene_velicine.includes(stavka.velicina)) {
            return res.status(400).json({greska: "Poslali ste velicinu koja nije podrzana."})
        }
    });

    console.log(`Id nove narudzbe je ${id_narudzba}`)

    narudzbe.push({id: id_narudzba, ...nova_narudzba})
    return res.status(201).json(nova_narudzba)
})

router.get('/' , (req, res) => {
    res.status(200).json(narudzbe)
})

export default router;