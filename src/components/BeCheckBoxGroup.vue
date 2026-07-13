<template>
  <el-checkbox-group v-model="localList" @change="syncParent">
    <slot>
      <template v-if="props.options">
        <el-checkbox v-for="op in props.options" :key="op.id" :label="getLangText(op.label, locale)" :value="op.value" />
      </template>
    </slot>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  modelValue?: string | null | undefined
  options?: []
}>()
const { t, locale } = useI18n() // 表单引用
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 本地列表（只在组件内自由修改，不触发递归）
const localList = ref<(string|number)[]>([])

// 父组件 → 子组件（只同步一次初始值 + 外部强制更新）
watch(
  () => props.modelValue,
  (val) => {
    const list = val ? JSON.parse(val) : []
    localList.value = list.length ? [...list] : []
  },
  { immediate: true }
)

function syncParent() {
  emit('update:modelValue', JSON.stringify(localList.value))
}
</script>
