<template>
    <div>Podaci za dostavu:</div>
  <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Prezime *"
      :value="prezime"
      @input="emit('update:prezime', $event.target.value)"
      class="w-full sm:w-48 px-3 py-2 rounded-md bg-slate-600/40 border border-slate-500 text-white text-sm outline-none focus:border-orange-400"
    />
    <input
      type="text"
      placeholder="Adresa *"
      :value="adresa"
      @input="emit('update:adresa', $event.target.value)"
      class="w-full sm:w-56 px-3 py-2 rounded-md bg-slate-600/40 border border-slate-500 text-white text-sm outline-none focus:border-orange-400"
    />
    <input
      type="tel"
      placeholder="Telefon *"
      :value="telefon"
      @input="emit('update:telefon', $event.target.value)"
      class="w-full sm:w-40 px-3 py-2 rounded-md bg-slate-600/40 border border-slate-500 text-white text-sm outline-none focus:border-orange-400"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  prezime: String,
  adresa: String,
  telefon: String,
})
const emit = defineEmits(['update:prezime', 'update:adresa', 'update:telefon'])
</script>