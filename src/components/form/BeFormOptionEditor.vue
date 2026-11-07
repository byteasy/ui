<template>
  <div class="flex-column w-full gap-1-2">
    <div class="flex-row w-full" v-for="op in localOptions" :key="op.id">
      <be-i18n-dynamic-input v-model="op.label" clearable @change="syncParent"/>
      <span>:</span>
      <el-input type="text" v-model="op.value" clearable v-if="props.formModel.type === 'string'"
                @change="syncParent"/>
      <el-input-number v-model="op.value" clearable v-if="props.formModel.type === 'number'"
                       controls-position="right" controls @change="syncParent"/>
      <el-select v-model="op.value" clearable v-if="props.formModel.type === 'boolean'"
                 @change="syncParent">
        <el-option :value="true" label="true"/>
        <el-option :value="false" label="false"/>
      </el-select>
      <el-button icon="Delete" type="danger" text @click="onRowDelete(op)"/>
    </div>
    <div class="flex-row w-full justify-content-end">
      <el-button icon="Plus" type="primary" text @click="addRow"/>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {ref, watch} from "vue";
import BeI18nDynamicInput from "@/components/BeI18nDynamicInput.vue";

const props = defineProps<{
  modelValue: Array<Record<string, any>> | undefined,
  formModel: object
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<Record<string, any>>): void
}>()
const localOptions = ref(props.modelValue?.length ? [...props.modelValue] : [])

watch(
  () => props.modelValue,
  (val) => {
    // 关键逻辑：比较内存地址或内容，如果不一致才赋值
    if (val !== localOptions.value) {
      localOptions.value = val ? [...val] : [];
    }
  },
  { deep: true }
)

function syncParent() {
  emit('update:modelValue', localOptions.value)
}

function addRow() {
  const newRow = {
    id: Math.random().toString(36).substr(2, 9), // 更好的唯一ID生成
    label: '',
    value: undefined
  };
  localOptions.value.push(newRow);
  syncParent()
}

function onRowDelete(row) {
  localOptions.value = localOptions.value?.filter((f) => f.id !== row.id)
  syncParent()
}
</script>
