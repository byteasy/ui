<template>
  <div class="w-full h-full flex-column">
    <el-scrollbar max-height="80vh" always class="w-full">
      <el-form ref="refForm" label-width="auto" label-position="right" class="w-ful "
               :model="formValue">
        <el-space wrap :direction="props.direction === undefined ? 'horizontal' : props.direction" class="w-full">
          <template v-for="col in props.columns" :key="col.name">
            <slot :name="'formItem_' + col.name" :column="col" :props="props" :row="formValue">
              <el-form-item
                :label="col.displayName"
                v-if="col.isForm === 'YES'"
                :prop="col.name"
                :rules="[
                {
                  required: col.isRequire === 'YES',
                  message: col.displayName + t('validate.required'),
                },
                {
                  validator: (rule, value, callback) => {
                    validateColumnRule(col, rule, value, callback)
                  },
                  trigger: 'blur',
                },
              ]"
              >
                <slot
                  :name="'formItemField_' + col.name"
                  :row="formValue"
                  :column="col"
                  :props="props"
                >
                  <tuna-form-field
                    :column="col"
                    :context="props.context"
                    :placeholder="col.displayName"
                    clearable
                    :disabled="props.readonly"
                    v-model="formValue[col.name]"
                    style="min-width: 300px"
                  />
                </slot>
              </el-form-item>
            </slot>
          </template>
        </el-space>
      </el-form>
    </el-scrollbar>
    <el-divider/>
    <div class="w-full flex-column">
      <el-affix position="bottom" class="w-full">
        <div class="flex-row w-full justify-content-center pb-2">
          <slot name="footerButton" :props="props">
            <el-button type="primary" @click="onSaveClick" icon="Check" v-if="!props.readonly">{{
                t('save')
              }}
            </el-button>
            <el-button @click="onClearForm" icon="Close">{{ t('close') }}</el-button>
          </slot>
        </div>
      </el-affix>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineEmits, defineExpose, ref} from 'vue'
import TunaFormField from '@/components/TunaFormField.vue'
import {useI18n} from 'vue-i18n'
import {doHttpPost} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {validateColumnRule} from '@/util/validateUtils.ts'

const emit = defineEmits(['close'])
const refForm = ref(null)

const props = defineProps<{
  url: string
  context: string
  columns: Array<any>
  row?: any
  readonly?: boolean
  direction?: string
}>()
const formValue = ref({...props.row})
const {t} = useI18n() // 表单引用

function onSaveClick() {
  refForm.value.validate((valid: boolean) => {
    if (valid) {
      doHttpPost(props.url, {}, formValue.value)
        .then(() => {
          ElMessage.success(t('operationSuccess'))
          emit('close')
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(t('operationFailed'))
        })
    }
  })
}

const validate = (): Promise<boolean> => {
  return new Promise((resolve) => {
    refForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })
}

function onClearForm() {
  refForm.value?.resetFields()
  emit('close')
}

defineExpose({
  props,
  validate,
  formValue,
  onSaveClick,
  onClearForm
})
</script>
<style scoped>
.tuna-form-height {
  max-height: 80vh !important;
}
</style>
