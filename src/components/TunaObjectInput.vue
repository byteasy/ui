<template>
  <div class="dynamic-object-input">
    <div v-for="(item, index) in localList" :key="index" class="flex-row">
      <el-input v-model="item.key" @input="syncToParent" />
      <span style="margin:0 4px">=</span>
      <el-input v-model="item.value" @input="syncToParent" v-bind="$attrs"/>
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
import {ref, watch} from 'vue'

interface KeyValueItem {
  key: string
  value: string
}

const props = defineProps<{
  modelValue?: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const loading = ref(false)
const localList = ref<KeyValueItem[]>([{key: '', value: ''}])

// 🔥 关键：加一个锁，避免自己修改触发watch覆盖
const isSelfUpdate = ref(false)

// 监听父组件传入
watch(
  () => props.modelValue,
  (newVal) => {
    // 🔥 核心修复：如果是自己触发的更新，跳过！
    if (isSelfUpdate.value) {
      isSelfUpdate.value = false
      return
    }

    if (!newVal) {
      localList.value = [{key: '', value: ''}]
      return
    }

    const list: KeyValueItem[] = []
    for (const [k, v] of Object.entries(newVal)) {
      list.push({
        key: k,
        value: v == null ? '' : String(v)
      })
    }

    localList.value = list.length ? list : [{key: '', value: ''}]
  },
  {immediate: true, deep: true}
)

// 新增
function handleAdd() {
  localList.value.push({key: '', value: ''})
  syncToParent()
}

// 删除
function handleDelete(index: number) {
  if (localList.value.length <= 1) return
  localList.value.splice(index, 1)
  syncToParent()
}

// 同步到父组件
function syncToParent() {
  // 🔥 加锁：告诉watch，这次是我自己改的，你别处理
  isSelfUpdate.value = true

  const obj: Record<string, any> = {}
  localList.value.forEach((item) => {
    if (item.key.trim()) {
      obj[item.key] = item.value
    }
  })
  emit('update:modelValue', obj)
}
</script>

<style scoped>
.dynamic-object-input {
  width: 100%;
}
</style>
