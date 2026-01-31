import { ref } from 'vue'
import { defineStore } from 'pinia'
import { safeGet, safePut } from '@/stores/localStorage.ts'

export const useAppSettingsStore = defineStore('appSettingsStore', () => {
  const theme = ref(safeGet('theme') !== null ? safeGet('theme') : 'light')
  const componentSize= ref(safeGet('componentSize') !== null ? safeGet('componentSize') : 'default')
  const lang = ref(safeGet('lang') !== null ? safeGet('lang') : 'zh-cn')

  function setTheme(value: string) {
    theme.value = value
    safePut('theme', value)
  }

  function setComponentSize(value: string) {
    componentSize.value = value
    safePut('componentSize', value)
  }

  function setLang(value: string) {
    lang.value = value
    safePut('lang', value)
  }

  return { theme, setTheme, componentSize, setComponentSize, lang, setLang }
})
