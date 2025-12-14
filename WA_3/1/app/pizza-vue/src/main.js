import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {OhVueIcon} from 'oh-vue-icons'

const app = createApp(App)

app.component("v-icon", OhVueIcon)

app.mount('#app')
