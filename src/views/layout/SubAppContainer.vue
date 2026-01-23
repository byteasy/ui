<template>
  <h1>SubAppContainer.vue You did it!</h1>
  <div id="sub-app-container"></div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { registerApps } from '@/util/qiankun'
import { start } from 'qiankun'

const { t } = useI18n()

console.log('SubAppContainer')

const win = window as Window & { qiankunStarted?: boolean }

if (!win.qiankunStarted) {
  console.log('qiankunStarted', win.qiankunStarted)
  win.qiankunStarted = true
  registerApps()
  start({
    sandbox: {
      experimentalStyleIsolation: true // 样式隔离
    },
    // 其他配置
    prefetch: true,
    singular: true,
    fetch: window.fetch,
  })
  console.log('qiankunStarted', 'success')
}
</script>

<style scoped></style>
