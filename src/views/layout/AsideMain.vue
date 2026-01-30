<template>
  <el-splitter class="">
    <el-splitter-panel size="200" collapsible :min="80" :max="240">
      <div class="m-1">
        <left-menu></left-menu>
      </div>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <div class="demo-panel">2</div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import LeftMenu from '@/views/layout/LeftMenu.vue'
</script>

<style scoped>
</style>
