// composables/useModal.ts
import type { Component } from 'vue'
import { markRaw, reactive } from 'vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

// 直接用 reactive 对象，不用 ref
interface ModalState {
  items: Array<{
    id: symbol
    props?: Record<string, unknown>
    visible: boolean
    component: Component
    dialogModel: boolean
    title?: string
    width?: string | number
    draggable: boolean
    closeOnClickModal: boolean
    fullscreen: boolean // 仅对dialog有效
    direction?: DrawerDirection // 仅对抽屉有效
    onClose?: (data?: unknown) => void
  }>
}

// 创建一个响应式状态
const state: ModalState = reactive({
  items: [],
})

export const useModal = () => {
  const appSettingsStore = useAppSettingsStore()

  const open = <P extends Record<string, unknown>>(
    component: Component,
    props?: P,
    options: Partial<Omit<ModalState['items'][0], 'id' | 'props' | 'visible'>> = {},
  ) => {
    const id = Symbol('modal')

    const defaultOptions = {
      draggable: true, // 默认值
      fullscreen: false,
      dialogModel: (appSettingsStore.dialogModel) === '1',
      closeOnClickModal: (appSettingsStore.closeOnClickModal) === '1',
      width: '50%',
      direction: appSettingsStore.drawerDirection as DrawerDirection,
    }

    // 直接操作 state.items
    state.items.push({
      id,
      component: markRaw(component),
      props: props || {},
      visible: true,
      ...defaultOptions, // 先应用默认值
      ...options,
      dialogModel: options?.dialogModel ?? defaultOptions.dialogModel
    })
    return id
  }

  const close = (id: symbol, data?: unknown) => {
    const index = state.items.findIndex((m) => m.id === id)
    if (index === -1) return

    const modal = state.items[index]
    if (modal === undefined) {
      return
    }
    modal.visible = false

    setTimeout(() => {
      const currentIndex = state.items.findIndex((m) => m.id === id)
      if (currentIndex > -1) {
        modal.onClose?.(data)
        state.items.splice(currentIndex, 1)
      }
    }, 300)
  }

  return {
    // 直接返回 state.items，这是响应式的
    modals: state.items,
    open,
    close,
  }
}
