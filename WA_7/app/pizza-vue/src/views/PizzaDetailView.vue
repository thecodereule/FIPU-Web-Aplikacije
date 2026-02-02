<template>
  <div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
    <div class="max-w-3xl mx-auto p-6 text-white">
      <router-link to="/" class="text-orange-400 font-semibold hover:text-orange-300"
        >← Natrag na popis</router-link
      >

      <div v-if="ucitavanje" class="mt-6">Učitavanje...</div>
      <div v-else-if="greska" class="mt-6 text-red-400 font-semibold">{{ greska }}</div>

      <div v-else-if="pizza" class="mt-6 space-y-6">
        <h1 class="text-3xl font-bold text-orange-400">{{ pizza.naziv }}</h1>
        <img
          :src="pizza.slika_url"
          :alt="pizza.naziv"
          class="w-full h-80 object-cover rounded-lg"
        />

        <div>
          <h2 class="text-xl font-semibold text-orange-300 mb-2">Sastojci</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="s in pizza.sastojci"
              :key="s"
              class="px-3 py-1 rounded-full border border-orange-400 text-black"
            >
              {{ s }}
            </span>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-orange-300 mb-2">Cijene</h2>
          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              :key="velicina"
              class="flex justify-between p-3 rounded border border-slate-600 bg-transparent"
            >
              <span class="text-black font-semibold">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <span class="text-orange-400 font-semibold">{{ cijena }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const pizza = ref(null)
const ucitavanje = ref(true)
const greska = ref(null)
const URL_express = 'http://localhost:3000'

onMounted(async () => {
  try {
    const naziv = route.params.naziv
    const { data } = await axios.get(`${URL_express}/pizze/${encodeURIComponent(naziv)}`)
    pizza.value = data
  } catch {
    greska.value = 'Pizza nije pronađena.'
  } finally {
    ucitavanje.value = false
  }
})
</script>
