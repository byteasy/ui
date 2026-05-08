<template>
  <div class="dynamic-array-input w-full h-full">
    <div
      v-for="(item, index) in safeList"
      :key="index"
      class="flex-row justify-content-start align-items-center w-full"
    >
      <el-input
        v-model="safeList[index]"
        placeholder="请输入内容"
        :disabled="loading"
        class="flex-grow"
      />

      <el-button
        type="danger"
        icon="Delete"
        :disabled="loading"
        @click="handleDelete(index)"
        circle
        size="small"
        class="flex-none ml-2"
      />

      <el-button
        type="primary"
        icon="Plus"
        size="small"
        circle
        :disabled="loading"
        @click="handleAdd"
        class="flex-none"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const props = defineProps<{
  modelValue?: string[] | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const loading = ref(false)

// 安全处理 + 空值时默认显示一个输入框
const safeList = computed(() => {
  const list = props.modelValue || []
  // 数组为空时，默认返回 [ '' ]，自动显示一个输入框
  return list.length === 0 ? [''] : list
})

// 新增
function handleAdd() {
  const newArr = [...safeList.value, '']
  emit('update:modelValue', newArr)
}

// 删除
function handleDelete(index: number) {
  const newArr = [...safeList.value]
  newArr.splice(index, 1)
  emit('update:modelValue', newArr)
}
</script>

<style scoped>
.dynamic-array-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
