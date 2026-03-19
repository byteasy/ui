<template>
  <div id="sub-app-container" class="child-app"></div>
</template>

<script lang="ts" setup>
import { registerApps } from '@/util/qiankun'
import { start } from 'qiankun'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { onUnmounted } from 'vue'
import router from '@/router'
console.log('sub-app-container onMounted')
const win = window as Window & { qiankunStarted?: boolean }
const appSettingsStore = useAppSettingsStore()
let hashChangeHandler: () => void

console.log('location.hash', location.hash)
if (!win.qiankunStarted) {
  console.log('qiankunStarted', win.qiankunStarted)
  win.qiankunStarted = true
  const subApps = JSON.parse(appSettingsStore.microAppConfig)
  let appArray = []
  for (let i = 0; i < subApps.length; i++) {
    const subApp = subApps[i]
    const cfg = {
      name: subApp.name,
      entry: subApp.entry,
      container: '#sub-app-container', // 挂载子应用的dom
      activeRule: (location) => {
        return location.pathname.includes(subApp.activeRule) ||
          location.hash.includes(subApp.activeRule)
      },
      props: subApp.props
    }
    appArray.push(cfg)
  }
  registerApps(appArray)
  start({
    sandbox: {
      experimentalStyleIsolation: true, // 样式隔离
    },
    // 其他配置
    prefetch: true,
    singular: true,
    fetch: window.fetch,
  })

  hashChangeHandler = () => {
    console.log('[qiankun] 检测到 hash 变化：', window.location.hash)
    if (win.__QIANKUN__) {
      // 方式1：调用 qiankun 内置的路由检测方法（推荐）
      win.__QIANKUN__.handleRouterChange()

      // 方式2：如果方式1无效，手动重新挂载激活的子应用（兜底）
      // const activeApp = win.__QIANKUN__._activeApps[0]
      // if (activeApp) win.__QIANKUN__.mountApp(activeApp)
    }
  }

  window.addEventListener('hashchange', hashChangeHandler)

  router.afterEach(() => {
    win.__QIANKUN__?.handleRouterChange()
  })
  console.log('qiankunStarted', 'success')

  onUnmounted(() => {
    if (hashChangeHandler) {
      window.removeEventListener('hashchange', hashChangeHandler)
    }
  })
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
