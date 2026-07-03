<template>
  <div class="flex-column h-full">
    <div class="flex-row w-full">
      <slot name="topBar"> </slot>
    </div>
    <div class="flex-grow w-full el-card" style="overflow-y: auto;">
      <div class="h-full w-full">
        <slot name="mainContent"></slot>
      </div>
    </div>
    <div class="flex-row justify-content-end w-full pt-1">
      <slot name="bottomBar"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
