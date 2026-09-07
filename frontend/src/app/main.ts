import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'
import './styles/main.css'
import { createPinia } from 'pinia'
import router from '@/app/router/router.ts'
import { tanstackQueryClient, VueQueryPlugin } from '@/app/tanstack'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient: tanstackQueryClient })

app.mount('#app')
