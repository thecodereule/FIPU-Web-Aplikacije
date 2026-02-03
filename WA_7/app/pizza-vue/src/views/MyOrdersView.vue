<template>
  <div class="mx-auto max-w-5xl px-4 py-6 md:px-6">
    <h1 class="text-2xl font-bold text-slate-800 mb-4">Moje narudžbe</h1>

    <div v-if="loading" class="text-slate-600">Učitavanje...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="narudzbe.length === 0" class="text-slate-600">
      Nemate nijednu narudžbu.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="narudzba in narudzbe"
        :key="narudzba._id"
        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="text-slate-800 font-semibold">
            {{ narudzba.ime }} • {{ narudzba.telefon }}
          </div>
          <div class="text-slate-600 text-sm">
            {{ formatDate(narudzba.createdAt) }}
          </div>
        </div>
        <div class="text-slate-600 text-sm mt-1">
          {{ narudzba.adresa }}
        </div>

        <div class="mt-3">
          <div class="font-medium text-slate-700 mb-2">Stavke:</div>
          <ul class="space-y-1">
            <li
              v-for="(stavka, index) in narudzba.narucene_pizze"
              :key="index"
              class="text-slate-700 text-sm"
            >
              {{ stavka.naziv }} ({{ stavka.veličina }}) × {{ stavka.količina }}
            </li>
          </ul>
        </div>

        <div class="mt-3 text-right font-semibold text-orange-600">
          Ukupno: {{ narudzba.ukupna_cijena?.toFixed(2) }}€
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const narudzbe = ref([])
const loading = ref(true)
const error = ref('')

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('hr-HR')
}

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get('/narudzbe')
    narudzbe.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri dohvaćanju narudžbi.'
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>
