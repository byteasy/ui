<template>
  <el-icon style="color: var(--my-menu-icon-color)"
           v-if="props.svg !== null && props.svg !== undefined">
    <div v-html="props.svg" v-if="props.svg.startsWith('<svg')"></div>
    <component v-else :is="props.svg"/>
  </el-icon>
</template>
<script setup lang="ts">
const props = defineProps<{
  svg: any
}>()
</script>
