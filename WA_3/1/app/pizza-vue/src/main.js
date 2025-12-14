import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {OhVueIcon} from 'oh-vue-icons'
import router from './router'

const app = createApp(App)

app.component("v-icon", OhVueIcon)
app.use(router)

app.mount('#app')
