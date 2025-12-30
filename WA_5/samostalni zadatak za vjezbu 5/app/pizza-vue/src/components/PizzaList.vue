<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <!-- Trazilica -->
    <form
      class="mx-auto mb-8 flex max-w-5xl flex-col gap-4 rounded-xl bg-white/80 p-4 shadow"
      @submit.prevent="primijeniFilter"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <label class="flex flex-col text-sm text-slate-700">
          Naziv
          <input
            v-model="search.naziv"
            type="text"
            placeholder="npr. margh..."
            class="mt-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label class="flex flex-col text-sm text-slate-700">
          Cijena min
          <input
            v-model="search.cijena_min"
            type="number"
            min="0"
            step="0.1"
            placeholder="8"
            class="mt-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label class="flex flex-col text-sm text-slate-700">
          Cijena max
          <input
            v-model="search.cijena_max"
            type="number"
            min="0"
            step="0.1"
            placeholder="12"
            class="mt-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label class="flex flex-col text-sm text-slate-700">
          Sortiraj po cijeni
          <select
            v-model="search.sort"
            class="mt-1 rounded border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          >
            <option value="">Bez sortiranja</option>
            <option value="asc">Uzlazno</option>
            <option value="desc">Silazno</option>
          </select>
        </label>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
        >
          Primijeni filter
        </button>
        <button
          type="button"
          @click="resetFilter"
          class="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Lista Pizza -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Pizze v-for -->
      <div
        v-for="pizza in pizze"
        :key="pizza.naziv"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza?.naziv === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
        @click="odaberi_pizzu(pizza)"
      >
        <div
          class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl"
        >
          <img :src="pizza.slika_url" :alt="pizza.slika_url" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

            <div class="flex space-x-2">
              <div
                v-for="sastojak in pizza.sastojci"
                class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                <v-icon :name="ikoneSastojaka[sastojak]"></v-icon>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              class="flex justify-between text-gray-700"
            >
              <span class="font-medium">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <span>€{{ cijena }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OrderFooter
      v-if="odabrana_pizza != null"
      :odabrana-pizza="odabrana_pizza"
      @close="odabrana_pizza = null"
    ></OrderFooter>
  </div>
</template>

<script setup>
import OrderFooter from './OrderFooter.vue'
import { addIcons } from 'oh-vue-icons'
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'

// registracija svih ikona koje koristim
addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)

import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

let odabrana_pizza = ref(null)
let pizze = ref([])

// stanje trazilice
const search = reactive({
  naziv: '',
  cijena_min: '',
  cijena_max: '',
  sort: '',
})

const URL_express = 'http://localhost:3000'

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

function odaberi_pizzu(novaPizza) {
  odabrana_pizza.value = novaPizza
  console.log(`Odabrana pizza je: ${odabrana_pizza.value.naziv}`)
}

async function dohvati_pizze(params = {}) {
  try {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )
    const response = await axios.get(`${URL_express}/pizze`, { params: cleaned })
    pizze.value = response.data
    console.log(`Dohvacene pizze sa backenda: ${pizze.value.map((pizza_obj) => pizza_obj.naziv)}`)
  } catch (error) {
    console.error(`Greska: ${error}`)
  }
}

function primijeniFilter() {
  dohvati_pizze(search)
}

function resetFilter() {
  search.naziv = ''
  search.cijena_min = ''
  search.cijena_max = ''
  search.sort = ''
  dohvati_pizze()
}

onMounted(() => {
  dohvati_pizze()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      odabrana_pizza.value = null // ponisti odabir pizze
    }
  })
})
</script>
