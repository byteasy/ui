<template>
  <el-input-tag v-model="localList" @change="syncParent"/>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | null | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 本地列表（只在组件内自由修改，不触发递归）
const localList = ref<string[]>([])

// 父组件 → 子组件（只同步一次初始值 + 外部强制更新）
watch(
  () => props.modelValue,
  (val) => {
    const list = val ? val.split(',') : []
    localList.value = list.length ? [...list] : []
  },
  { immediate: true }
)

function syncParent() {
  emit('update:modelValue', localList.value.join(','))
}
</script>
