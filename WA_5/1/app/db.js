import { MongoClient } from "mongodb";
import { config } from "dotenv";

config()

let mongoURI = process.env.MONGO_URI;
let db_name = process.env.MONGO_DB_NAME
const cluster = "FIPU-WA-Cluster";


async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoURI);   
    await client.connect();
    console.log("Uspjesno spajanje na bazu podataka.");
    let db = client.db(db_name);
    return db;
  } catch (error) {
    console.error("Greska prilikom spjanja na bazu podataka ", error);
    throw error;
  }
}

export { connectToDatabase };
