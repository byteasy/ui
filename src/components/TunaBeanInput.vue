<template>
  <el-descriptions border :column="props.columns || 1" direction="vertical">
    <template v-for="col in tableColumns" :key="col.name">
      <el-descriptions-item :label="getLangText(col.displayName, locale)"
                            v-if="col.isShow === 'YES'">
        <slot :name="'view_' + col.name" :value="formValue[col.name]">
          <tuna-form-field
            :column="col"
            :context="props.context"
            :placeholder="getLangText(col.displayName, locale)"
            clearable
            :disabled="props.disabled"
            v-model="formValue[col.name]"
            @change="onUpdateModelValueClick"
          />
        </slot>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script setup lang="ts">

import {defineEmits, ref} from 'vue'
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
</script>

<style scoped></style>
