import { dostupne_pizze } from "../data/pizze_data.js";


export function checkArray(array) {
   return Array.isArray(array) && array.length != 0;
}


export function same_arrays(array1, array2) {
    if (!checkArray(array1) || !checkArray(array2)) {
        return false;
    }  

    if (array1.length != array2.length) {
        return false;
    }

    return array1.every(element => array2.includes(element))
}

// helper funkcija koja provjerava postoji li pizza u bazi
export function pizzaExists(id_pizza) {
    return Boolean (dostupne_pizze.find(pizza => pizza.id == id_pizza))
}