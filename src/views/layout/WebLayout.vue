<template>
  <el-config-provider :locale="locale" :size="componentSize as any">
    <div class="layout my-bg-color-blank">
      <navbar-default class="navbar-default" />
      <div class="layout__content">
        <div class="bg-color-page m-1"><router-view /></div>
      </div>
    </div>
    <widget-modal-container />
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { computed, ref, onBeforeMount } from 'vue'
import NavbarDefault from '@/views/layout/NavbarDefault.vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { container as WidgetModalContainer } from 'jenesius-vue-modal'
import { watch } from 'vue'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const appSettingsStore = useAppSettingsStore()

const { theme, componentSize } = storeToRefs(appSettingsStore)

onBeforeMount(() => {
  window.document.documentElement.setAttribute('class', theme.value!)
  // window.document.body.setAttribute('class', fontsize.value)
})

watch(
  () => theme.value,
  (newTheme, oldTheme) => {
    console.log('主题变化:', oldTheme, '→', newTheme)
    window.document.documentElement.setAttribute('class', theme.value!)
  },
  { immediate: true }, // 是否立即执行一次
)
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 视口高度 */
  overflow: hidden; /* 防止整体出现滚动条 */
}
.navbar-default {
  flex-shrink: 0; /* 防止导航栏被压缩 */
  height: 55px; /* 设置导航栏的具体高度，根据实际情况调整 */
}
.layout__content {
  flex: 1; /* 占据剩余空间 */
  overflow: auto; /* 如果内容过多，在内容区域内滚动 */
  min-height: 0; /* 重要：修复flex容器中的滚动问题 */
}
</style>
