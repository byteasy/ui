import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.ts'
import {
  renderWithQiankun,
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/style/style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './locales'
import { debounce } from './directive/debounce'
import App from './App.vue'

let app

const render = (container) => {
  app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  app.use(ElementPlus)
  app.directive('debounce', debounce)

  app.mount(container ? container.querySelector('#app') : '#app')
}

const initQianKun = () => {
  console.log('init in qianqun')
  renderWithQiankun({
    mount(props) {
      console.log('unmount')
      const { container } = props
      render(container)
    },
    bootstrap() {
    },
    unmount() {
      console.log('unmount')
      app.unmount()
    }
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
