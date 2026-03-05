<template>
  <div>Password<el-button @click="showForm">打开表单111</el-button></div>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: 'close', data?: unknown): void
  (e: 'confirm', data?: unknown): void
}>()
const showForm = () => {
  emit('confirm', { closedBy: 'button' })
}
</script>
