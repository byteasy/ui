<template>
  <el-splitter>
    <el-splitter-panel size="300" collapsible :min="300" :max="600">
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <be-object-list :meta-data="{ className: 'com.byteasy.platform.entity.EbApplication'}" />
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import BeObjectList from "@/views/template/BeObjectList.vue";
</script>
