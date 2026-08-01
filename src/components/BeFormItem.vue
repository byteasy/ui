<template>
  <template v-for="col in tableColumns" :key="col.name">
    <slot :name="'formItem_' + col.name" :column="col" :props="props" :row="formValue">
      <el-form-item :label="getLangText(col.displayName, locale)"
                    v-if="col.isForm === 'YES'" :prop="col.name" :rules="[
                    { required: col.isRequire === 'YES', message: getLangText(col.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(col, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <slot :name="'formItemField_' + col.name" :row="formValue" :column="col" :props="props">
          <component :is="getComponent(parseComponent(col.fieldComponent))"
                     :param="parseComponentParam(col.fieldComponent)"
                     :formModel="formValue"
                     v-if="col.fieldComponent"
                     :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
                     :column="col"
                     clearable
                     :disabled="props.readonly"
                     v-model="formValue[col.name]"/>
          <be-form-field
            v-else
            :column="col"
            :placeholder="getLangText(col.displayName, locale)"
            clearable
            :disabled="props.readonly"
            v-model="formValue[col.name]"
            @clear="formValue[col.name] = null"
          >
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </be-form-field>
        </slot>
      </el-form-item>
    </slot>
  </template>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import BeFormField from '@/components/BeFormField.vue'
import {useI18n} from 'vue-i18n'
import {getEntitySchema} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {validateColumnRule} from '@/util/validateUtils.ts'
import {parseComponent, parseComponentParam, putValueIfValid} from '@/util/common.ts'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {getLangText} from '@/locales/common.ts'
import {getRouteComponents} from "@/util/autoImportComponent.ts";

const {t, locale} = useI18n()
const appSettingsStore = useAppSettingsStore()
const {modules} = getRouteComponents()

const props = defineProps<{
  columns?: Array<any>
  className?: string
  row?: any
  readonly?: boolean
  param?: object
  formModel?: object
  queryParam?: object
}>()

const formValue = ref({...props.row})
const tableColumns = ref(props.columns ?? [])

onMounted(() => {
  if (!props.columns) loadTableColumns()
})

function loadTableColumns() {
  getEntitySchema(props.className)
    .then((response) => {
      const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data))
      tableColumns.value = arrs
    })
    .catch(() => ElMessage.error(t('table.loadingTableColumnsError')))
}

function sortColumnsByShowOrder(columns) {
  return [...columns].sort((a, b) => a.showOrder - b.showOrder)
}

function mergeLocalStorage(data) {
  const fields = appSettingsStore.getStorageObject(props.className + '.fields')
  if (!fields) return data

  data.forEach(col => {
    const custom = fields[col.name]
    if (custom) {
      putValueIfValid(col, 'width', custom.width)
      putValueIfValid(col, 'showOrder', custom.showOrder)
      putValueIfValid(col, 'isShow', custom.isShow)
      putValueIfValid(col, 'isSort', custom.isSort)
      putValueIfValid(col, 'isOverflow', custom.isOverflow)
      putValueIfValid(col, 'isSearch', custom.isSearch)
      putValueIfValid(col, 'align', custom.align)
    }
  })
  return data
}

function getComponent(path) {
  return modules['..' + path]
}
</script>
