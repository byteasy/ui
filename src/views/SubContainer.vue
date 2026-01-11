<template>
  <div id="sub-container"></div>
</template>

<script>
import { start } from 'qiankun'
import { registerApps } from '@/utils/qiankun.js'
export default {
  name: 'SubContainer',
  mounted() {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true
      registerApps()
      start({
        sandbox: {
          experimentalStyleIsolation: true // 样式隔离
        }
      })
    }
  }
}
</script>
