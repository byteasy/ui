<template>
  <div class="app-container my-bg-color-blank">
    <router-view />
    <dialog-container />
  </div>
</template>

<script lang="ts" setup>
</script>
<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 建议由子应用内部决定滚动条 */
}
</style>
<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
}
</style>
