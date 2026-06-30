<template>
  <el-color-picker :show-alpha="props.param?.showAlpha" />
</template>
<script lang="ts" setup>
const props = defineProps<{
  param?: object
}>()
</script>
