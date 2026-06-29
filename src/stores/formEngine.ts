import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormEngine = defineStore('formEngine', () => {
  // 初始值用 null，避免空对象访问属性报错
  const activeComponent = ref<any | null>(null)

  // 设置当前选中组件，深拷贝防止外部篡改仓库数据
  function setActiveComponent(component: any | null) {
    if (!component) {
      activeComponent.value = null
      return
    }
    activeComponent.value = JSON.parse(JSON.stringify(component))
  }

  return {
    activeComponent,
    setActiveComponent,
  }
})
