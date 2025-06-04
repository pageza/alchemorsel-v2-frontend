import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import './style.css'
import './plugins/axios'  // Import the axios configuration

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
