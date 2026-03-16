<template>
  <div class="w-full h-full flex-column">
    <el-form
      :inline="true"
      ref="refForm"
      label-width="200"
      label-position="right"
      class="w-full"
      :model="formValue"
    >
      <el-space wrap direction="horizontal" style="width: 100%">
        <template v-for="col in props.columns" :key="col.name">
          <slot :name="'formItem_' + col.name" :column="col">
            <el-form-item
              :label="col.displayName"
              v-if="col.isForm === 'YES'"
              :prop="col.name"
              :required="col.isRequire === 'YES'"
              :rules="[
                {
                  validator: (rule, value, callback) => {
                    validateColumnRule(col, rule, value, callback)
                  },
                  trigger: 'blur',
                },
              ]"
            >
              <tuna-form-field
                :column="col"
                :context="props.context"
                :placeholder="col.displayName"
                clearable
                :disabled="props.readonly"
                v-model="formValue[col.name]"
                style="width: 300px"
                :align="col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'"
              />
            </el-form-item>
          </slot>
        </template>
      </el-space>
    </el-form>
    <div class="w-full flex-column p-3">
      <el-divider />
      <div class="flex-row w-full justify-content-center">
        <el-button type="primary" @click="onSaveClick" icon="Check" v-if="!props.readonly">{{
          t('save')
        }}</el-button>
        <el-button @click="onClearForm" icon="Close">{{ t('close') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import TunaFormField from '@/components/TunaFormField.vue'
import { useI18n } from 'vue-i18n'
import { doHttpPost } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { validateColumnRule } from '@/util/validateUtils.ts'

const emit = defineEmits(['close'])
const refForm = ref(null)

const props = defineProps<{
  url: string
  context: string
  columns: Array<any>
  row?: any
  readonly?: boolean
}>()
const formValue = ref({ ...props.row })
const { t } = useI18n() // 表单引用

function onSaveClick() {
  refForm.value.validate((valid) => {
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

function onClearForm() {
  refForm.value?.resetFields()
  emit('close')
}
</script>
