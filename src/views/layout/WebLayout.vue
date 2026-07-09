<template>
  <el-config-provider :locale="locale" :size="componentSize as any">
    <div class="layout my-bg-color-blank">
      <navbar-default class="navbar-default" />
      <div class="layout__content" >
        <div style="height: 100%;"><router-view /></div>
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, watch } from 'vue'
import NavbarDefault from '@/views/layout/NavbarDefault.vue'
import { storeToRefs } from 'pinia'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { elementLocales } from '@/locales/common.ts'

const appSettingsStore = useAppSettingsStore()
const { theme, componentSize, lang } = storeToRefs(appSettingsStore)
const locale = computed(() => elementLocales[lang.value])

onBeforeMount(() => {
  setTheme()
  setFontSize()
})

function setFontSize() {
  // 移除旧的字体类
  window.document.documentElement.classList.remove('font-small', 'font-default', 'font-large')

  if (componentSize.value === 'default') {
    window.document.documentElement.classList.add('font-default')
  }
  if (componentSize.value === 'small') {
    window.document.documentElement.classList.add('font-small')
  }
  if (componentSize.value === 'large') {
    window.document.documentElement.classList.add('font-large')
  }
}

function setTheme() {
  window.document.documentElement.classList.remove('dark', 'light', 'green', 'blue')
  window.document.documentElement.classList.add(theme.value!)
}

watch(
  () => theme.value,
  (newTheme, oldTheme) => {
    console.log('主题变化:', oldTheme, '→', newTheme)
    setTheme()
  },
  { immediate: true }, // 是否立即执行一次
)

watch(
  () => componentSize.value,
  (newTheme, oldTheme) => {
    console.log('字体变化:', oldTheme, '→', newTheme)
    setFontSize()
  },
  { immediate: true }, // 是否立即执行一次
)

watch(
  () => lang.value,
  (newTheme, oldTheme) => {
    console.log('语言变化:', oldTheme, '→', newTheme)
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
