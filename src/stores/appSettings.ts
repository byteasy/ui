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
  const componentSize = ref(
    safeGet('componentSize') !== null ? safeGet('componentSize') : 'default',
  )
  /**
   * 显示语言
   */
  const lang = ref(safeGet('lang') !== null ? safeGet('lang') : 'zh-CN,zh;')
  /**
   * 导航模式
   */
  const tagView = ref(safeGet('tagView') !== null ? safeGet('tagView') : '0')
  /**
   * 弹窗方式
   */
  const dialogModel = ref(safeGet('dialogModel') !== null ? safeGet('dialogModel') : '1')

  /**
   * 全局对话框是否允许点击外部关闭
   */
  const closeOnClickModal = ref(safeGet('closeOnClickModal') !== null ? safeGet('closeOnClickModal') : '1')

  /**
   * 抽屉展示方向
   */
  const drawerDirection= ref(safeGet('drawerDirection') !== null ? safeGet('drawerDirection') : 'rtl')

  /**
   * 微应用的入口配置
   */
  const microAppConfig = ref('')

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

  function setCloseOnClickModal(value: string) {
    closeOnClickModal.value = value
    safePut('closeOnClickModal', value)
  }

  function setDrawerDirection(value: string) {
    drawerDirection.value = value
    safePut('drawerDirection', value)
  }

  function setMicroAppConfig(value: string) {
    microAppConfig.value = value
  }

  return {
    theme,
    setTheme,
    componentSize,
    setComponentSize,
    lang,
    setLang,
    tagView,
    setTagView,
    dialogModel,
    setDialogModel,
    closeOnClickModal,
    setCloseOnClickModal,
    drawerDirection,
    setDrawerDirection,
    microAppConfig,
    setMicroAppConfig,
  }
})
