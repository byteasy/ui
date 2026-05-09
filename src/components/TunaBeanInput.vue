<template>
  <el-descriptions border :column="props.columns || 1" direction="vertical" class="fix-descriptions">
    <template v-for="col in tableColumns" :key="col.name">
      <el-descriptions-item v-if="col.isForm === 'YES'"
                            :label="getLangText(col.displayName || col.name, locale)" :label-width="90" :label-style="{ width: '90px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }">
        <template v-slot:default>
          <slot :name="'form-json-' + col.name" :props="props" :row="formValue" :column="col">
            <tuna-form-field
              :column="col"
              :context="props.context"
              :placeholder="getLangText(col.displayName || col.name, locale)"
              clearable
              :disabled="props.disabled"
              v-model="formValue[col.name]"
              @change="onUpdateModelValueClick"
            />
          </slot>
        </template>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script setup lang="ts">

import {defineEmits, ref, watch} from 'vue'
import {getEntitySchema} from '@/api/common/platform'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import TunaFormField from "@/components/TunaFormField.vue";

const {t, locale} = useI18n() // 表单引用

const props = defineProps<{
  disabled?: boolean
  className: string
  context: string
  modelValue?: Record<string, any> | null
  onEditClick?: (data?: unknown) => void
  columns?: number
}>()

const emit = defineEmits(['update:modelValue'])

const tableColumns = ref([])
const formValue = ref({...props.modelValue})

getEntitySchema(props.context, props.className)
  .then((response) => {
    tableColumns.value = response.data
  })

function onUpdateModelValueClick() {
  emit('update:modelValue', formValue.value)
}

watch(() => formValue, () => {
    onUpdateModelValueClick()
  },
  {deep: true}
)
</script>

<style scoped>
/* 强制锁住 el-descriptions，永不撑开布局 */
.fix-descriptions {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

/* 强制 label 宽度固定，自动换行 */
.fix-descriptions :deep(.el-descriptions__label) {
  width: 90px !important;
  min-width: 90px !important;
  max-width: 90px !important;
  white-space: pre-wrap !important;
  word-break: break-all !important;
  overflow: hidden !important;
}

/* 强制内容区域不溢出，不撑开 */
.fix-descriptions :deep(.el-descriptions__content) {
  min-width: 0 !important;
  overflow: hidden !important;
  word-break: break-all !important;
}
</style>
