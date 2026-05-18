import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/style/style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './locales'
import { debounce } from './directive/debounce'
import { focus } from './directive/focus'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.directive('debounce', debounce)
app.directive('focus', focus)

app.mount('#app')
