<template>
  <el-image fit="cover" :src="props.modelValue" :preview-src-list="[props.modelValue || '']" preview-teleported />
</template>
<script lang="ts" setup>

const props = defineProps<{
  modelValue: string | undefined
  row: object
  column: object
}>()
</script>
