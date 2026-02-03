<template>
  <header class="w-full border-b border-slate-200 bg-slate-700 backdrop-blur-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
      <!-- Left: Brand -->
      <div class="flex items-center gap-2">
        <!-- Simple logo circle -->
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
          <img
            src="https://png.pngtree.com/png-clipart/20250703/original/pngtree-pizza-logo-transparent-image-free-for-online-download-png-image_21265162.png"
            alt="Logo"
            class="h-5 w-5 object-contain"
          />
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            Pizza app
          </span>
          <span class="text-[11px] text-slate-200"> Fresh • Fast • Hot </span>
        </div>
      </div>

      <!-- Center: Navigation -->
      <nav class="flex items-center gap-4">
        <router-link 
          to="/" 
          class="text-sm font-medium text-slate-200 hover:text-orange-400 transition-colors"
        >
          Home
        </router-link>
        <router-link 
          v-if="!isLoggedIn"
          to="/login" 
          class="text-sm font-medium text-slate-200 hover:text-orange-400 transition-colors"
        >
          Prijava
        </router-link>
        <router-link 
          v-if="!isLoggedIn"
          to="/register" 
          class="text-sm font-medium text-slate-200 hover:text-orange-400 transition-colors"
        >
          Registracija
        </router-link>
        <router-link 
          v-if="isLoggedIn"
          to="/narudzbe" 
          class="text-sm font-medium text-slate-200 hover:text-orange-400 transition-colors"
        >
          Moje narudžbe
        </router-link>
        <button
          v-if="isLoggedIn"
          type="button"
          @click="handleLogout"
          class="text-sm font-medium text-slate-200 hover:text-orange-400 transition-colors"
        >
          Odjava
        </button>
      </nav>

      <!-- Right: Address -->
      <div class="hidden text-right text-xs leading-snug text-slate-200 sm:block">
        <div class="font-medium text-slate-200">Negrijeva 6</div>
        <div class="text-[11px] text-slate-200">52100 Pula</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(!!localStorage.getItem('token'))

const updateAuthState = () => {
  isLoggedIn.value = !!localStorage.getItem('token')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  updateAuthState()
  window.dispatchEvent(new Event('auth-changed'))
  router.push('/')
}

onMounted(() => {
  window.addEventListener('storage', updateAuthState)
  window.addEventListener('auth-changed', updateAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateAuthState)
  window.removeEventListener('auth-changed', updateAuthState)
})
</script>
