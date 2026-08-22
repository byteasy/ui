<template>
  <be-table
    ref="refTable"
    :class-name="metaData.className"
    :api-query="metaData.apiQuery"
    :api-save="metaData.apiSave"
    :api-delete="metaData.apiDelete"
    :api-download-import-template="metaData.apiDownloadImportTemplate"
    :api-export="metaData.apiExport"
    :api-import-batch-save="metaData.apiImportBatchSave"
    :api-import-preview="metaData.apiImportPreview"
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
    :multiple="metaData.multiple"
    :show-lang="metaData.showLang"
    :show-summary="metaData.showSummary"
    :data-render-finish="props.dataRenderFinish"
    :row-db-click="props.rowDbClick"
    v-if="loading === false"
  >
    <!-- 查询栏自定义组件 -->
    <template v-slot:query-form="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormComponent))" v-if="metaData.queryFormComponent"
                 :param="parseComponentParam(metaData.queryFormComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-extra="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormExtraComponent))" v-if="metaData.queryFormExtraComponent"
                 :param="parseComponentParam(metaData.queryFormExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-buttons="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormButtonsComponent))" v-if="metaData.queryFormButtonsComponent"
                 :param="parseComponentParam(metaData.queryFormButtonsComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-buttons-extra="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormButtonExtraComponent))" v-if="metaData.queryFormButtonExtraComponent"
                 :param="parseComponentParam(metaData.queryFormButtonExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <!-- 工具栏自定义组件，分为工具栏按钮拓展组件和更多下拉菜单拓展组件 -->
    <template v-slot:tool-buttons-extra="scope">
      <component :is="getComponent(parseComponent(metaData.toolButtonsExtraComponent))" v-if="metaData.toolButtonsExtraComponent"
                 :param="parseComponentParam(metaData.toolButtonsExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:more-action-extra="scope">
      <component :is="getComponent(parseComponent(metaData.moreActionExtraComponent))" v-if="metaData.moreActionExtraComponent"
                 :param="parseComponentParam(metaData.moreActionExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <!-- 操作列的自定义组件， 分为整个操作列组件\编辑按钮后的组件\删除按钮后的组件 -->
    <template v-slot:table-operation="scope">
      <component :is="getComponent(parseComponent(metaData.operationColumnComponent))" v-if="metaData.operationColumnComponent"
                 :param="parseComponentParam(metaData.operationColumnComponent)"
                 :refTable="refTable"
                 :row="scope.row"></component>
    </template>
    <template v-slot:table-operation-extra="scope">
      <component :is="getComponent(parseComponent(metaData.operationColumnExtraComponent))" v-if="metaData.operationColumnExtraComponent"
                 :param="parseComponentParam(metaData.operationColumnExtraComponent)"
                 :refTable="refTable"
                 :row="scope.row"></component>
    </template>
    <template v-slot:table-operation-end-extra="scope">
      <component :is="getComponent(parseComponent(metaData.operationColumnExtraEndComponent))" v-if="metaData.operationColumnExtraEndComponent"
                 :param="parseComponentParam(metaData.operationColumnExtraEndComponent)"
                 :refTable="refTable"
                 :row="scope.row"></component>
    </template>
  </be-table>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import {defineExpose, defineModel, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
import {executeOpenApi} from "@/api/common/platform";

const props = defineProps<{
  className?: string
  layoutPramsId?: string
  meta?: object

  // 是否查询模式，开启后表格不能做编辑类操作
  queryMode?: boolean
  // 是否多选，仅由前端传递，适合对象的选择
  multiple?: boolean

  formComponent?: string
  // 页面数据加载完的回调函数
  dataRenderFinish?: (tableData) => void
  // 双击函数
  rowDbClick?: (row: any) => void
}>()

const {t, locale} = useI18n()
const refTable = ref(null)
const loading = ref(true)
const {modules} = getRouteComponents()
const metaData = ref({...props.meta})
const queryParams = defineModel<any>('queryParams', {
  default: () => ({
    current: 1,
    size: 20,
    descColumns: []
  })
})

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

    if (props.formComponent) {
      metaData.value.formComponent = props.formComponent
    }
    if (props.queryMode) {
      metaData.value.queryMode = props.queryMode
    }
    if (props.multiple) {
      metaData.value.multiple = props.multiple
    }

    console.log('className: ' + metaData.value.className + ' metaData: ', metaData.value)
  })
})

const setCurrentRow = (row) => {
  refTable.value?.setCurrentRow(row)
}

const toggleRowSelection = (row, checked) => {
  refTable.value?.toggleRowSelection(row, checked)
}

const getSelectionRows = () => {
  return refTable.value?.getSelectionRows()
}

defineExpose({
  setCurrentRow, toggleRowSelection, getSelectionRows
})
</script>
