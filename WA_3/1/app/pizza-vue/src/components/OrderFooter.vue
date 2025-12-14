<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white"
  >
    <button
      @click="emit('close')"
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
    >
      ×
    </button>

    <!-- Forma za dostavu -->
    <div class="mb-4 pb-4 border-b border-slate-600">
      <DeliveryForm
        v-model:prezime="prezime"
        v-model:adresa="adresa"
        v-model:telefon="telefon"
      />
    </div>

    <!-- Ostatak elemenata -->
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6"
    >
      <!-- Slika pizze i naziv -->
      <div
        class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 w-full sm:w-auto"
      >
        <img
          :src="odabranaPizza.slika_url"
          :alt="odabranaPizza.naziv"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40"
        />
        <div>
          <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
            {{ odabranaPizza.naziv }}
          </h3>
        </div>
      </div>

      <!-- Odabir veličina + cijene -->
      <div
        class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto"
      >
        <button
          @click="odabranaVelicina = velicina"
          v-for="(cijena, velicina) in odabranaPizza.cijene"
          :key="velicina"
          :class="[
            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
            odabranaVelicina === velicina
              ? 'bg-orange-500 text-white'
              : 'bg-slate-600/40 text-white',
          ]"
        >
          {{ velicina.charAt(0).toUpperCase() + velicina.slice(1) }} – {{ cijena }}
        </button>
      </div>

      <!-- Odabir količine -->
      <div class="flex items-center justify-center gap-4 w-full sm:w-auto">
        <div class="flex items-center justify-center space-x-2">
          <button
            @click="odabranaKolicina > 1 ? odabranaKolicina-- : (odabranaKolicina = 1)"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
          >
            -
          </button>
          <div
            class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base"
          >
            {{ odabranaKolicina }}
          </div>
          <button
            @click="odabranaKolicina++"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
          >
            +
          </button>
        </div>
        <div
          class="text-center font-semibold text-lg text-orange-400 tracking-wide whitespace-nowrap"
        >
          Ukupno: {{ ukupna_cijena_stavke }}€
        </div>
      </div>

      <!-- Gumbi -->
      <button
        @click="dodajUNarudzbu()"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Dodaj u košaricu
      </button>
      <button
        @click="naruciPizze()"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Naruči
      </button>
    </div>

    <!-- Košarica -->
    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li
          v-for="(stavka, index) in narucene_pizze"
          :key="index"
          class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
        >
          <div class="text-white">
            {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
          </div>
          <div class="text-orange-400 font-semibold">
            {{ (stavka.cijenaPoKomadu * stavka.kolicina).toFixed(2) }}€
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import DeliveryForm from './DeliveryForm.vue'

const prezime = ref('')
const adresa = ref('')
const telefon = ref('')

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const odabranaVelicina = ref(Object.keys(props.odabranaPizza.cijene)[0])
const narucene_pizze = ref([])
const odabranaKolicina = ref(1)
const URL_express = 'http://localhost:3000'

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value]
  return (cijenaPoKomadu * odabranaKolicina.value).toFixed(2)
})

function dodajUNarudzbu() {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value]
  const novaStavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: odabranaKolicina.value,
    cijenaPoKomadu,
  }
  narucene_pizze.value.push(novaStavka)
  console.log(`Dodajem pizzu u kosaricu: ${novaStavka.naziv}`)

  for (let stavka of narucene_pizze.value) {
    console.log(stavka)
  }
}

async function naruciPizze() {
  try {
    if (narucene_pizze.value.length === 0) {
      alert('Košarica je prazna! Molimo dodajte pizze prije narudžbe.')
      return
    }
    if (!prezime.value.trim() || !adresa.value.trim() || !telefon.value.trim()) {
      alert('Unesite prezime, adresu i telefon.')
      return
    }

    const rezultat = await axios.post(`${URL_express}/narudzbe`, {
      narucene_pizze: narucene_pizze.value,
      adresa_dostava: adresa.value.trim(),
      broj_telefona: telefon.value.trim(),
    })

    console.log('Narudžba uspješno poslana:', rezultat.data)
    alert('Hvala! Vaša narudžba je uspješno poslana.')
  } catch (error) {
    console.log(`Greska prilikom narucivanja: ${error}`)
    alert('Doslo je do greske pri slanju narudzbe. Molimo pokusajte ponovno')
  }
}
</script>
