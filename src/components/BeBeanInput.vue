<template>
  <el-descriptions border :column="props.columns || 1" direction="vertical"
                   class="fix-descriptions" :size="props.size">
    <template v-for="col in tableColumns" :key="col.name">
      <el-descriptions-item v-if="col.isForm === 'YES'" :label-width="90"
                            :label-style="{ width: '90px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }">
        <template v-slot:label>
          <el-text type="danger" v-if="col.isRequire === 'YES'" :size="props.size">*</el-text>
          <span>{{ getLangText(col.displayName || col.name, locale) }}</span>
        </template>
        <template v-slot:default>
          <slot :name="'form-json-' + col.name" :props="props" :row="formValue" :column="col">
            <el-form :model="formValue" :ref="(el) => (refBeanFields[col.name] = el)" :size="props.size">
              <el-form-item
                v-if="col.isForm === 'YES'"
                :prop="col.name"
                :rules="[
                    { required: col.isRequire === 'YES', message: getLangText(col.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(col, rule, value, locale, callback), trigger: 'blur' }
                  ]">
                <component :is="getComponent(parseComponent(col.fieldComponent))"
                           :param="parseComponentParam(col.fieldComponent)"
                           :formModel="formValue"
                           v-if="col.fieldComponent"
                           :context="props.context ? props.context : 'platformSvr'"
                           :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
                           :column="col"
                           clearable
                           :disabled="props.disabled"
                           v-model="formValue[col.name]"
                           @change="onUpdateModelValueClick"></component>
                <tuna-form-field
                  :column="col"
                  v-else
                  :context="props.context ? props.context : 'platformSvr'"
                  :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
                  clearable
                  :disabled="props.disabled"
                  v-model="formValue[col.name]"
                  @change="onUpdateModelValueClick"/>
              </el-form-item>
            </el-form>
          </slot>
        </template>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script setup lang="ts">

import {defineEmits, defineExpose, onMounted, ref, watch} from 'vue'
import {getEntitySchema} from '@/api/common/platform'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import TunaFormField from "@/components/TunaFormField.vue";
import {validateColumnRule} from '@/util/validateUtils.ts'
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
const {modules } = getRouteComponents()

const {t, locale} = useI18n() // 表单引用

const props = defineProps<{
  className: string
  context?: string
  disabled?: boolean
  modelValue?: Record<string, any> | null
  columns?: number
  size?: string
}>()

const emit = defineEmits(['update:modelValue'])

const tableColumns = ref([])
const formValue = ref({...props.modelValue})
const refBeanFields = ref({})

function getComponent(path) {
  return modules['..' + path]
}

onMounted(() => {
  loadDynamicFields()
})

function loadDynamicFields() {
  getEntitySchema(props.context ? props.context : 'platformSvr', props.className)
    .then((response) => {
      tableColumns.value = response.data
      for (const col in tableColumns.value) {
        refBeanFields.value[col.name] = null
      }
    })
}

function onUpdateModelValueClick() {
  emit('update:modelValue', formValue.value)
}

watch(() => formValue, () => {
    onUpdateModelValueClick()
  },
  {deep: true}
)

watch(() => props.modelValue, () => {
  formValue.value = props.modelValue
})

watch(() => props.className, () => {
  loadDynamicFields()
})

async function validateForm() {
  const fieldRefs = Object.values(refBeanFields.value)
  const validatableRefs = fieldRefs.filter(Boolean)
  try {
    await Promise.all(
      validatableRefs.map(item => item.validate()) // 每个都执行校验
    )
    console.log('全部校验成功')
    return true
  } catch (error) {
    console.log('校验失败', error)
    return false
  }
}

async function resetFields() {
  const fieldRefs = Object.values(refBeanFields.value)
  const validatableRefs = fieldRefs.filter(Boolean)
  try {
    await Promise.all(
      validatableRefs.map(item => item.resetFields()) // 每个都执行校验
    )
    return true
  } catch (error) {
    return false
  }
}

defineExpose({
  validateForm, resetFields
})
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
