<template>
  <div id="sub-app-container" class="child-app"></div>
</template>

<script lang="ts" setup>
import {registerApps} from '@/util/qiankun'
import {addGlobalUncaughtErrorHandler, start} from 'qiankun'
import {onMounted, onUnmounted} from 'vue'
import router from '@/router'
import {doHttpGet} from "@/api/common/platform";

console.log('sub-app-container onMounted')
const win = window as Window & { qiankunStarted?: boolean }
let hashChangeHandler: () => void

function replaceHostVar(entry: string): string {
  // 如果不包含 {host}，直接返回原字符串
  if (!entry.includes('{host}')) {
    return entry;
  }
  // 获取当前 origin（如 http://localhost:3000）
  const baseUrl = window.location.host;
  // 替换所有 {host} 并返回
  return entry.replace(/{host}/g, baseUrl);
}

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceCategorys/topMenu').then((res) => {
    const microApps = []
    for (let i = 0; i < res.data.resourceCategoryVOS.length; i++) {
      const parent = res.data.resourceCategoryVOS[i]
      for (let m = 0; m < parent.children.length; m++) {
        const entry = parent.children[m]
        for (let j = 0; j < entry.resourceGroups.length; j++) {
          const group = entry.resourceGroups[j]

          const path = group.router
          const pathArrs = (path || '').split('/')

          if (group.isMicroapp === 'YES') {
            // 构建微应用的配置信息
            const microAppConfig = {
              name: group.code,
              entry: replaceHostVar(group.entry),
              container: '#sub-app-container', // 挂载子应用的dom
              activeRule: '/' + pathArrs[1] + '/' + pathArrs[2], // 路由匹配规则
              props: group.props ? JSON.parse(group.props) : {},
            }
            microApps.push(microAppConfig)
          }
        }
      }
    }

    console.log('location.hash', location.hash)
    if (!win.qiankunStarted) {
      console.log('qiankunStarted', win.qiankunStarted)
      win.qiankunStarted = true
      const subApps = microApps
      const appArray = []
      for (let i = 0; i < subApps.length; i++) {
        const subApp = subApps[i]
        const cfg = {
          name: subApp.name,
          entry: replaceHostVar(subApp.entry),
          container: '#sub-app-container', // 挂载子应用的dom
          activeRule: (location) => {
            return (
              location.pathname.includes(subApp.activeRule) || location.hash.includes(subApp.activeRule)
            )
          },
          props: subApp.props,
        }
        appArray.push(cfg)
      }
      console.log('micro app registerApps', appArray)
      registerApps(appArray)

      addGlobalUncaughtErrorHandler((event, source, lineno, colno, error) => {
        console.log('qiankun 微应用加载错误：', event, source, lineno, colno, error)
      })

      start({
        sandbox: {
          experimentalStyleIsolation: false, // 样式隔离
        },
        // 其他配置
        prefetch: false,
        singular: true,
        fetch: window.fetch,
      })

      hashChangeHandler = () => {
        console.log('[qiankun] 检测到 hash 变化：', window.location.hash)
        if (win.__QIANKUN__) {
          // 方式1：调用 qiankun 内置的路由检测方法（推荐）
          console.log('handleRouterChange')
          win.__QIANKUN__.handleRouterChange()
          // 方式2：如果方式1无效，手动重新挂载激活的子应用（兜底）
          // const activeApp = win.__QIANKUN__._activeApps[0]
          // if (activeApp) win.__QIANKUN__.mountApp(activeApp)
        }
      }

      window.addEventListener('hashchange', hashChangeHandler)

      router.afterEach(() => {
        console.log('handleRouterChange')
        win.__QIANKUN__?.handleRouterChange()
      })
      console.log('qiankunStarted', 'success')

      onUnmounted(() => {
        if (hashChangeHandler) {
          window.removeEventListener('hashchange', hashChangeHandler)
        }
      })
    }
  })
})

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
