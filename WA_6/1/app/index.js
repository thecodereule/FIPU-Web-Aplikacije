import express from 'express'

const app = express()
app.use(express.json())

let PORT = 3000;

function middleware_fn(req, res, next) {
    next()
}

app.get("/", [middleware_fn], (req, res) => {
    res.status(200).send('Root endpoint posluzitelja')
})

app.listen(PORT, error => {
    if (error) {
        console.log(`Greska prilikom pokretanja servera: ${error.message}`)
    } else {
        console.log(`Server pokrenut na portu: ${PORT}`)
    }
})