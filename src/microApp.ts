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
import * as Vue from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as ElementPlusModule from 'element-plus'
import * as VueI18n from 'vue-i18n'
import i18n from './locales'
import App from './App.vue'
import { loader } from '@guolao/vue-monaco-editor'

import { debounce } from './directive/debounce'
import { focus } from './directive/focus'
import { permission } from './directive/permission'

let app: any

const render = (container) => {
  loader.config({
    paths: {
      vs: '/platformSvr/common/lib/monaco-editor/vs'
    }
  })

  ;(window as any).__SHARED_VUE__ = Vue
  ;(window as any).__SHARED_ELEMENT_PLUS__ = ElementPlusModule
  ;(window as any).__SHARED_ELEMENT_ICONS__ = ElementPlusIconsVue
  ;(window as any).__SHARED_VUE_I18N__ = VueI18n

  app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  app.use(ElementPlus)
  app.directive('debounce', debounce)
  app.directive('focus', focus)
  app.directive('permission', permission)


  app.mount(container ? container.querySelector('#app') : '#app')
}

const initQianKun = () => {
  console.log('[SubApp] init in qiankun')
  renderWithQiankun({
    mount(props) {
      console.log('[SubApp] mount')
      const { container } = props
      render(container)
    },
    bootstrap() {
      console.log('[SubApp] bootstrap')
    },
    unmount() {
      console.log('[SubApp] unmount')
      if (app) {
        app.unmount()
        app = null // 关键：释放内存！
      }
    }
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
