<template>
  <el-splitter class="">
    <el-splitter-panel size="200" collapsible :min="80" :max="240">
      <div class="m-1">
        <left-menu></left-menu>
      </div>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <div class="flex-column ml-1">
        <div class="el-card is-always-shadow p-1" style="height: 2rem; width: 100%">
          <bread-crumb />
        </div>
        <div class="el-card is-always-shadow p-2 mt-1" style="width: 100%">
          <router-view />
        </div>
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import LeftMenu from '@/views/layout/LeftMenu.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
</script>

<style scoped></style>
