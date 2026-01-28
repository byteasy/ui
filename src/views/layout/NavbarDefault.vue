<script setup lang="ts">
import whiteLogo from '@/assets/img/black-logo.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="navbar-layout">
    <div style="display: flex; align-items: center;"><img :src="whiteLogo" class="system_logo" alt="" /><span class="system-title">-{{ t('title') }}</span></div>
    <div>右侧内容</div>
  </div>
</template>

<style scoped>
.navbar-layout {
  height: 55px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 16px; /* 添加左右内边距 */
}

.system_logo {
  display: inline-block;
  margin-left: 0;
  height: 55px;
}

.system-title {
  font-size: 20px;
  font-weight: bold; /* 加粗 */
  color: #222;

  /* 完美垂直居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 55px; /* 与 navbar 同高 */
  line-height: 1;
  /* 可选字体增强 */
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  letter-spacing: 0.5px;
}
</style>
