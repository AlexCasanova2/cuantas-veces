import '/src/assets/main.css'

console.log('>>> [main.ts] App y CSS importados');

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

console.log('>>> [main.ts] App montada en #app');
