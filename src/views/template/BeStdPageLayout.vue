<template>
  <be-table
    ref="refTable"
    :class-name="metaData.className"
    :api-query="metaData.apiQuery"
    :api-save="metaData.apiSave"
    :api-delete="metaData.apiDelete"
    :query-params="metaData.queryParams"
    :excel-import-component="metaData.excelImportComponent"
    :title-column-name="metaData.titleColumnName || 'name'"
    :operation-column-width="metaData.operationColumnWidth"
    :dialog-model="metaData.dialogModel"
    :form-width="metaData.formWidth"
    :form-component="getComponent(metaData.formComponent)"
    :pagination-visible="metaData.paginationVisible"
    :query-form-visible="metaData.queryFormVisible"
    :row-key="metaData.rowKey"
    :default-expand-all="metaData.defaultExpandAll"
    :tree-props="metaData.treeProps"
    :query-mode="metaData.queryMode"
    :show-lang="metaData.showLang"
    :show-summary="metaData.showSummary"
    v-if="loading === false"
  >
    <template v-slot:form-query-buttons-extra="scope">
      <component v-for="btn in formQueryButtonsExtra"
                 :key="btn + '_' + (scope.row.id || scope.$index)"
                 :is="getComponent( parseComponent(btn))"
                 :param="parseComponentParam(btn)"
                 :queryParam="scope.queryParam" :queryMode="scope.queryMode"></component>
    </template>
    <template v-slot:table-operation-extra="scope">
      <component v-for="btn in operationButtons" :key="btn + '_' + (scope.row.id || scope.$index)"
                 :is="getComponent(parseComponent(btn))"
                 :param="parseComponentParam(btn)"
                 :tableRef="refTable"
                 :row="scope.row"></component>
    </template>
  </be-table>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import {defineModel, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
import {executeOpenApi} from "@/api/common/platform";

const props = defineProps<{
  className?: string
  layoutPramsId?: string
  meta?: object
}>()

const {t, locale} = useI18n()
const refTable = ref(null)
const loading = ref(true)
const {modules} = getRouteComponents()
const formQueryButtonsExtra = ref([])
const operationButtons = ref([])
const metaData = ref({ ...props.meta })
const queryParams = defineModel<any>('queryParams', {default: () => ({current: 1, size: 20, descColumns: []})})

function getComponent(path) {
  return modules['..' + path]
}

onMounted(() => {
  executeOpenApi('getLayoutParamsByIdOrClassName', {
    id: props.layoutPramsId,
    className: props.className,
    idQueryType: 'eq',
    classNameQueryType: 'eq'
  }, {}).then(rsp => {
    const layoutParams = rsp.data.records[0]
    Object.assign(metaData.value, layoutParams)
    metaData.value.queryParams = queryParams.value
    Object.assign(metaData.value.queryParams, JSON.parse(layoutParams.queryParams || "{}"))
    loading.value = false

    console.log('className: ' + metaData.value.className + ' metaData: ', metaData.value)
  })
})
</script>
