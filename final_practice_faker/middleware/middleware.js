import { ObjectId } from "mongodb";
import {connectToDatabase} from '../db.js'

const isValidObjectId = (id) => typeof id === 'string' && id.length === 24;

const findUserById = async (req, res, next) => {
    const {id} = req.params

    if (!isValidObjectId(id)) {
        return res.status(400).json({message: 'id mora biti string od 24 znaka'})
    }

    try {
        const db = await connectToDatabase()
        const user = await db.collection("users").findOne({_id: new ObjectId(id)})

        if (!user) {
            return res.status(404).json({message: "Korisnik nije pronaden"})
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(500).json({
            message: "Greska pri dohvatu korisnika", 
            error: error.message
        })
    }
}

const logger = (req, res, next) => {
    res.on("finish", () => {
        const timestamp = new Date().toISOString()
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode}`)
    })
    next()
}

export {findUserById, logger}