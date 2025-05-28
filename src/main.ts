import { createApp } from '@vue/runtime-dom'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

console.log('>>> [main.ts] App y CSS importados');

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

console.log('>>> [main.ts] App montada en #app');
