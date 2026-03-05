<template>
  <div class="app-container">
    <router-view />
    <dialog-container />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import DialogContainer from '@/components/dialog/DialogContainer.vue'

const { t } = useI18n()
window.document.title = t('title')
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden; /* 防止内部内容溢出 */
}
</style>
