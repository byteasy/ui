<template>
  <div id="sub-app-container" class="child-app"></div>
</template>

<script lang="ts" setup>
import { registerApps } from '@/util/qiankun'
import { start } from 'qiankun'

console.log('sub-app-container onMounted')
const win = window as Window & { qiankunStarted?: boolean }

if (!win.qiankunStarted) {
  console.log('qiankunStarted', win.qiankunStarted)
  win.qiankunStarted = true
  registerApps()
  start({
    sandbox: {
      experimentalStyleIsolation: true, // 样式隔离
    },
    // 其他配置
    prefetch: true,
    singular: true,
    fetch: window.fetch,
  })
  console.log('qiankunStarted', 'success')
}
</script>

<style>
.child-app {
  width: 100% !important;
  height: 100% !important;
}
div[id^='__qiankun_microapp_wrapper'] {
  height: 100% !important;
  display: flex;
  flex: 1;
}
</style>
