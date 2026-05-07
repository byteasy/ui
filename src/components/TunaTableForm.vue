<template>
  <div class="w-full flex-column">
    <el-scrollbar max-height="80vh" always class="w-full">
      <el-form ref="refForm" label-width="auto" label-position="right" class="w-full"
               :model="formValue">
        <el-space wrap :direction="props.direction === undefined ? 'horizontal' : props.direction" class="w-full">
          <template v-for="col in tableColumns" :key="col.name">
            <slot :name="'formItem_' + col.name" :column="col" :props="props" :row="formValue">
              <el-form-item
                :label="getLangText(col.displayName, locale)"
                v-if="col.isForm === 'YES'"
                :prop="col.name"
                :rules="[
                {
                  required: col.isRequire === 'YES',
                  message: getLangText(col.displayName, locale) + ' ' + t('validate.required'),
                },
                {
                  validator: (rule, value, callback) => {
                    validateColumnRule(col, rule, value, locale, callback)
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
                    :placeholder="getLangText(col.displayName, locale)"
                    clearable
                    :disabled="props.readonly"
                    v-model="formValue[col.name]"
                    style="min-width: 300px"
                  />
                </slot>
              </el-form-item>
            </slot>
          </template>
          <slot name="formExtra" :props="props" :row="formValue">
          </slot>
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
import {defineEmits, defineExpose, onMounted, ref} from 'vue'
import TunaFormField from '@/components/TunaFormField.vue'
import {useI18n} from 'vue-i18n'
import {doHttpPost, getEntitySchema} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {validateColumnRule} from '@/util/validateUtils.ts'
import {putValueIfValid} from "@/util/common.ts";
import {useAppSettingsStore} from "@/stores/appSettings.ts";
import {getLangText} from "@/locales/common.ts";

const {t, locale} = useI18n() // 表单引用
const emit = defineEmits(['close'])
const refForm = ref(null)
const appSettingsStore = useAppSettingsStore()

const props = defineProps<{
  url: string
  context: string
  columns?: Array<any>
  className?: string
  row?: any
  readonly?: boolean
  direction?: string
}>()
const formValue = ref({...props.row})
const tableColumns = ref(props.columns ?? [])
const queryParam = ref({})

onMounted(() => {
  if(props.columns === undefined) {
    loadTableColumns()
  }
})

function loadTableColumns() {
  getEntitySchema(props.context, props.className)
    .then((response) => {
      const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data))
      tableColumns.value = arrs
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('table.loadingTableColumnsError'))
    })
}

function sortColumnsByShowOrder(columns) {
  return columns.sort((a, b) => a.showOrder - b.showOrder)
}

function mergeLocalStorage(data: Array<never>) {
  const fieldsDefine = appSettingsStore.getStorageObject(props.className + '.fields')
  if (fieldsDefine !== undefined) {
    data.forEach((column) => {
      if (fieldsDefine[column.name] !== undefined) {
        const fieldCustomDefine = fieldsDefine[column.name]
        putValueIfValid(column, 'width', fieldCustomDefine.width)
        putValueIfValid(column, 'showOrder', fieldCustomDefine.showOrder)
        putValueIfValid(column, 'isShow', fieldCustomDefine.isShow)
        putValueIfValid(column, 'isSort', fieldCustomDefine.isSort)
        putValueIfValid(column, 'isOverflow', fieldCustomDefine.isOverflow)
        putValueIfValid(column, 'isSearch', fieldCustomDefine.isSearch)
        putValueIfValid(column, 'align', fieldCustomDefine.align)
      }
    })
  }
  return data
}

function onSaveClick() {
  refForm.value?.validate((valid: boolean) => {
    if (valid) {
      doHttpPost(props.url, queryParam.value, formValue.value)
        .then(() => {
          ElMessage.success(t('operationSuccess'))
          emit('close')
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
  queryParam,
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
