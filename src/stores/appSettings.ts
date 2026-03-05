import { ref } from 'vue'
import { defineStore } from 'pinia'
import { safeGet, safePut } from '@/stores/localStorage.ts'

export const useAppSettingsStore = defineStore('appSettingsStore', () => {
  /**
   * 主题颜色
   */
  const theme = ref(safeGet('theme') !== null ? safeGet('theme') : 'light')
  /**
   * 显示尺寸大小
   */
  const componentSize= ref(safeGet('componentSize') !== null ? safeGet('componentSize') : 'default')
  /**
   * 显示语言
   */
  const lang = ref(safeGet('lang') !== null ? safeGet('lang') : 'zh-cn')
  /**
   * 导航模式
   */
  const tagView= ref(safeGet('tagView') !== null ? safeGet('tagView') : '0')
  /**
   * 弹窗方式
   */
  const dialogModel= ref(safeGet('dialogModel') !== null ? safeGet('dialogModel') : '0')

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

  function setTagView(value: string) {
    tagView.value = value
    safePut('tagView', value)
  }

  function setDialogModel(value: string) {
    dialogModel.value = value
    safePut('dialogModel', value)
  }

  return { theme, setTheme, componentSize, setComponentSize, lang, setLang, tagView, setTagView, dialogModel, setDialogModel }
})
