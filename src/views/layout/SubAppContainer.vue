<template>
  <div id="sub-app-container" class="child-app"></div>
</template>

<script lang="ts" setup>
import { registerApps } from '@/util/qiankun'
import { start } from 'qiankun'
import { onMounted } from 'vue'

// 类型声明优化
interface WindowWithQiankun extends Window {
  qiankunStarted?: boolean
  fetch: typeof fetch
}
const win = window as WindowWithQiankun

// 封装 qiankun 启动逻辑为异步函数
async function initQiankun() {
  try {
    // 确保只启动一次
    if (win.qiankunStarted) return

    console.log('qiankun 开始初始化', win.qiankunStarted)
    win.qiankunStarted = true

    // 先注册应用，再启动 qiankun
    registerApps()

    // 修复核心问题：await start() 的 Promise 返回值
    await start({
      sandbox: {
        experimentalStyleIsolation: true, // 样式隔离
      },
      prefetch: true,
      singular: true,
      // 修复 fetch 赋值方式：使用原始 fetch 或自定义兼容函数
      fetch: (...args) => window.fetch(...args),
    })

    console.log('qiankun 启动成功')
  } catch (error) {
    console.error('qiankun 启动失败:', error)
    // 生产环境下可以增加错误兜底逻辑
    win.qiankunStarted = false
  }
}

// 关键修复：在 Vue 组件挂载后执行（确保 DOM 和环境就绪）
onMounted(async () => {
  await initQiankun()
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
