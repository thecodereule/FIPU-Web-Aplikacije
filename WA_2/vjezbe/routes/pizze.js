import express from 'express';
const router = express.Router();

const pizze = [
    {
        id: 1,
        naziv: 'Margherita',
        cijene: {
            mala: 7.00,
            srednja: 8.50,
            velika: 10.00
        }
    },
    {
        id: 2,
        naziv: 'Capricciosa',
        cijene: {
            mala: 6.50,
            srednja: 8.00,
            velika: 9.00,
            jumbo: 12.00
        }
    },
    {
        id: 3,
        naziv: 'Quattro formaggi',
        cijene: {
            mala: 5.50,
            srednja: 6.70,
            velika: 8.00,
            jumbo: 12.00
        }
    },
    {

        id: 4,
        naziv: 'Šunka sir',
        cijene: {
            mala: 6.20,
            srednja: 7.20,
            velika: 8.50,
            jumbo: 10.50
        }
    },
    {

        id: 5,
        naziv: 'Vegetariana',
        cijene: {
            mala: 7.40,
            srednja: 8.60,
            velika: 9.50,
            jumbo: 11.50
        }
    }
]

router.get('/', (req, res) => {
    res.json(pizze);
});

router.get('/:id', (req, res) => {
    const id_pizza = req.params.id;

    if (isNaN(id_pizza)) {
        res.json({ message: 'Prosljedili se parametar id koji nije broj' });
        return;
    }

    const pizza = pizze.find(pizza => pizza.id == id_pizza)
    if (pizza) {
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s trazenim ID-om ne postoji' });
    }
})

export default router;