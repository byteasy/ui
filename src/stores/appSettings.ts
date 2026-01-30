import { ref } from 'vue'
import { defineStore } from 'pinia'
import { safeGet, safePut } from '@/stores/localStorage.ts'

export const useAppSettingsStore = defineStore('appSettingsStore', () => {
  const theme = ref(safeGet('theme') !== null ? safeGet('theme') : 'light')

  function setTheme(value: string) {
    theme.value = value
    safePut('theme', value)
  }

  return { theme, setTheme }
})
