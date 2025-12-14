<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Pizze v-for -->
      <div
      v-for="pizza in pizze" :key="pizza.naziv"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration300',
          odabrana_pizza === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
        @click="odaberi_pizzu(pizza.naziv)"
      >
        <div class="w-full h-48 flex items-center justify-center bg-inherit">
          <img
            src="https://www.freeiconspng.com/uploads/pizza-png-1.png"
            alt="Pizza Image 1"
            class="w-full h-full object-contain"
          />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{pizza.naziv}}</h2>

            <div class="flex space-x-2">
              <div
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                Icon
              </div>
              <div
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                Icon
              </div>
              <div
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                Icon
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Mala</span>
              <span>€00.00</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Srednja</span>
              <span>€00.00</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Jumbo</span>
              <span>€00.00</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

let odabrana_pizza = ref(null)
let pizze = ref([])

const URL_express = 'http://localhost:3000'

function odaberi_pizzu(novaPizza) {
  odabrana_pizza.value = novaPizza
  console.log(`Odabrana pizza je: ${odabrana_pizza.value}`)
}

async function dohvati_pizze() {
  try {
    let response = await axios.get(`${URL_express}/pizze`)
    pizze.value = response.data
    console.log(`Dohvacene pizze sa backenda: ${pizze.value.map((pizza_obj) => pizza_obj.naziv)}`)
  } catch (error) {
    console.error(`Greska: ${error}`)
  }
}

onMounted(() => {
  dohvati_pizze()
})
</script>
