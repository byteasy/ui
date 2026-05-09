<template>
  <div class="dynamic-array-input w-full h-full">
    <div
      v-for="(item, index) in localList"
      :key="index"
      class="flex-row justify-content-start align-items-center w-full mb-1"
    >
      <el-input
        v-model="localList[index]"
        :disabled="loading"
        class="flex-grow"
        @blur="syncParent"
        v-bind="$attrs"
      />

      <el-button
        type="danger"
        icon="Delete"
        :disabled="loading"
        @click="handleDelete(index)"
        circle
        size="small"
        class="flex-none ml-1"
      />

      <el-button
        type="primary"
        icon="Plus"
        size="small"
        circle
        :disabled="loading"
        @click="handleAdd"
        class="flex-none ml-1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string[] | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const loading = ref(false)

// 本地列表（只在组件内自由修改，不触发递归）
const localList = ref<string[]>([])

// 父组件 → 子组件（只同步一次初始值 + 外部强制更新）
watch(
  () => props.modelValue,
  (val) => {
    const list = val ?? []
    localList.value = list.length ? [...list] : ['']
  },
  { immediate: true }
)

// 子组件 → 父组件（手动 emit，不深度监听！避免递归）
function syncParent() {
  emit('update:modelValue', [...localList.value])
}

// 新增
function handleAdd() {
  localList.value.push('')
  syncParent()
}

// 删除
function handleDelete(index: number) {
  localList.value.splice(index, 1)
  syncParent()
}
</script>

<style scoped>
.dynamic-array-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
</style>
