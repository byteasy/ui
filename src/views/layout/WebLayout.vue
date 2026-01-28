<template>
  <el-config-provider :locale="locale">
    <div class="layout">
      <navbar-default class="navbar-default" />
      <div class="layout__content"><router-view /></div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { computed, ref } from 'vue'
import NavbarDefault from '@/views/layout/NavbarDefault.vue'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
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
