<template>
  <be-container>
    <template v-slot:topBar>
      <be-table-tool-bar v-if="props.queryFormVisible !== false && tableColumns.length > 0"
                      :query-params="queryParams" :table-props="props" :fields="tableColumns"
                      class="w-full" @refresh="refresh()" @add="onAdd"
                      @moreAction="onMoreActionClick">
        <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
          <slot :name="name" v-bind="slotProps"></slot>
        </template>
      </be-table-tool-bar>
    </template>
    <template v-slot:mainContent>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <be-table-view
            ref="refBeTableView"
            v-if="viewModel === 'table'"
            :table-props="props"
            :fields="tableColumns"
            :show-summary="props.showSummary === true"
            :height="height"
            :data="tableData.records"
            @row-dblclick="onTableRowDoubleClick"
            @row-click="onTableRowClick"
            @header-dragend="onHeaderDrag"
            @row-action="onRowActionHandle"
            @refresh="refresh"
            v-loading="loading"
            :row-key="props.rowKey"
            :default-expand-all="props.defaultExpandAll">
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </be-table-view>
          <be-card-list-view v-else
                             ref="refBeTableView"
                             :table-props="props"
                             :fields="tableColumns"
                             :width="width"
                             :height="height"
                             :data="tableData.records"
                             @row-action="onRowActionHandle"
                             @row-dblclick="onTableRowDoubleClick"
                             v-loading="loading">
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </be-card-list-view>
        </template>
      </el-auto-resizer>
    </template>
    <template v-slot:bottomBar v-if="props.paginationVisible !== false">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :default-page-size="20"
        :total="parseInt(tableData.total)"
        @change="onPageChange"
      />
    </template>
  </be-container>
</template>

<script lang="ts" setup>
import {
  type Component,
  defineEmits,
  defineExpose,
  defineModel,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue'
import {watchDebounced} from '@vueuse/core'
import BeContainer from '@/components/BeContainer.vue'
import {doHttpDelete, doHttpGet, executeOpenApi, getEntitySchema} from '@/api/common/platform'
import {ElMessage, type TableColumnCtx} from 'element-plus'
import {useI18n} from 'vue-i18n'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {putValueIfValid} from "@/util/common.ts";
import BeTableColumnDefine from "@/components/BeTableColumnDefine.vue";
import {getLangText} from "@/locales/common.ts";
import BeExcelImport from "@/components/BeExcelImport.vue";
import BeExcelExport from "@/components/BeExcelExport.vue";
import {useModal} from "@/components/dialog/useModal.ts";
import BeTableContainer from "@/components/BeTableContainer.vue";
import BeForm from "@/components/BeForm.vue";

const appSettingsStore = useAppSettingsStore()
const {t, locale} = useI18n()

const props = defineProps<{
  className: string
  apiQuery: string
  apiSave?: string
  apiDelete?: string
  apiDownloadImportTemplate?: string
  apiImportPreview?: string
  apiImportBatchSave?: string
  apiExport?: string
  titleColumnName?: string
  formWidth?: string | number
  operationColumnWidth?: number
  paginationVisible?: boolean
  queryFormVisible?: boolean
  dialogModel?: boolean
  rowKey?: string
  defaultExpandAll?: boolean
  treeProps?: object
  showLang?: string
  queryMode?: boolean
  multiple?: boolean
  showSummary?: boolean
  formComponent?: Component
  excelImportComponent?: Component
  excelExportComponent?: Component
  rowDbClick?: (row: any) => void
  dataRenderFinish?: (tableData) => void
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({total: '0'})
const loading = ref(false)
const viewModel = ref(appSettingsStore.getValue(props.className + '.viewModel') || 'table')
const refBeTableView = ref(null)
const {open} = useModal()
const queryParams = defineModel<any>('queryParams', {default: () => ({current: 1, size: 20, descColumns: []})})

watchDebounced(queryParams, (newVal, oldVal) => {
  console.log('tableQueryParams', newVal)
  refresh()
}, {
  deep: true,
  debounce: 400,
  maxWait: 1500
})

onBeforeMount(() => {
  loadTableColumns()
})

function loadTableColumns() {
  getEntitySchema(props.className)
    .then((response) => {
      const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data))
      console.log('arrs', arrs)
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

onMounted(() => {
  refresh()
})

function onPageChange(currentPage, pageSize) {
  queryParams.value.current = currentPage
  queryParams.value.size = pageSize
}

function refresh() {
  loading.value = true
  if(props.apiQuery.startsWith('/')) {
    doHttpGet(props.apiQuery, queryParams.value)
      .then((rsp) => {
        tableData.value = rsp.data
        loading.value = false

        nextTick(() => {
          if (props.dataRenderFinish) {
            props.dataRenderFinish(tableData.value)
          }
        })
      })
  } else {
    executeOpenApi(props.apiQuery, queryParams.value, {}).then((rsp) => {
      tableData.value = rsp.data
      loading.value = false

      nextTick(() => {
        if (props.dataRenderFinish) {
          props.dataRenderFinish(tableData.value)
        }
      })
    })
  }
}

function onTableRowClick(row) {
  emit('rowClick', row)
}

function onTableRowDoubleClick(row) {
  if (props.rowDbClick) {
    props.rowDbClick(row)
  } else {
    onView(row)
  }
}

function onHeaderDrag(newWidth: number, oldWidth: number, column: TableColumnCtx<T>, event: MouseEvent) {
  let fieldsDefine = appSettingsStore.getStorageObject(props.className + '.fields')
  if (fieldsDefine === undefined) {
    fieldsDefine = {}
  }
  if (fieldsDefine[column.property] === undefined) {
    fieldsDefine[column.property] = {}
  }
  fieldsDefine[column.property].width = newWidth
  appSettingsStore.putStorageObject(props.className + '.fields', fieldsDefine)
}

function getSelectionRows() {
  return refBeTableView.value?.getSelectionRows()
}

function toggleRowSelection(row, sel) {
  refBeTableView.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row) {
  refBeTableView.value?.setCurrentRow(row)
}

function getFormComponent() {
  if (props.formComponent) {
    console.log('Load form:', props.formComponent)
    return props.formComponent
  } else {
    console.log('Load form: BeForm')
    return BeForm
  }
}

function getFormWidth() {
  return props.formWidth !== undefined ? props.formWidth : '60%'
}

function onMoreActionClick(action) {
  if (action === 'switchView') {
    switchViewModel()
  } else if (action === 'columnDefine') {
    onColumnDefineClick()
  } else if (action === 'downLoadExcelTemplate') {
    downLoadExcelTemplate()
  } else if (action === 'excelImport') {
    onExcelImportClick()
  } else if (action === 'excelExport') {
    onExcelExportClick()
  }
}

function onRowActionHandle(action, args) {
  if (action === 'edit') {
    onEdit(args)
  } else if (action === 'view') {
    onView(args)
  } else if (action === 'delete') {
    onDelete(args)
  } else if (action === 'detailTable') {
    onOpenTableDetail(args.column, args.row)
  }
}

function switchViewModel() {
  if (viewModel.value === 'table') {
    viewModel.value = 'cardList'
  } else {
    viewModel.value = 'table'
  }
  appSettingsStore.putValue(props.className + '.viewModel', viewModel.value)
}

function onColumnDefineClick() {
  open(
    BeTableColumnDefine,
    {
      columns: mergeLocalStorage(tableColumns.value),
      className: props.className,
    }, // 传给组件的 props
    {
      title: t('table.customColumn'),
      width: '90%',
      onClose: (data) => {
        // TODO
        // loadTableColumns()
      },
    },
  )
}

function downLoadExcelTemplate() {
  window.open(props.baseUrl + '/excel/template?lang=' + appSettingsStore.lang, '_blank')
}

function onExcelImportClick() {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      props.excelImportComponent || BeExcelImport,
      {
        columns: tableColumns.value,
        url: props.baseUrl,
      }, // 传给组件的 props
      {
        title: t('table.importByExcel') + '>' + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        btnOkTitle: 'table.importByExcelSubmitButton',
        onClose: (data) => {
          refresh()
        }
      }
    )
  })
}

function onExcelExportClick() {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      props.excelExportComponent || BeExcelExport,
      {
        columns: tableColumns.value,
        queryParams: queryParams.value,
      },
      {
        title: t('table.exportToExcel') + '>' + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        btnOkTitle: 'table.exportByExcelSubmitButton',
        onClose: (data) => {
          refresh()
        }
      }
    )
  })
}

function onView(row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      getFormComponent(), // 要显示的组件
      {
        row: row,
        className: props.className,
        readonly: true,
      }, // 传给组件的 props
      {
        title: t('table.view') + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
        onClose: (data) => {
        },
      },
    )
  })
}

function onOpenTableDetail(column, row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + column.externalClass, {}).then(entityDefine => {
    const extrasParams = JSON.parse(column.extrasParams || '{}')
    const queryParams = { row: row, column: column}
    queryParams[column.externalClassPrimaryField + 'QueryType'] = 'eq'
    queryParams[column.externalClassPrimaryField] = row[column.innerPrimaryField]
    Object.assign(queryParams, extrasParams?.queryParams || {})
    const metaData = { queryParams: queryParams, className: column.externalClass }
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
        footer: extrasParams.dialogOption?.footer === undefined ? true : extrasParams.dialogOption?.footer,
      },
    )
  })
}


function onAdd(row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      getFormComponent(), // 要显示的组件
      {row: row, className: props.className, apiSave: props.apiSave }, // 传给组件的 props
      {
        title: t('add') + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
        onClose: (data) => {
          if (data === 'ok') {
            refresh()
          }
        },
      },
    )
  })
}

function onEdit(row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      getFormComponent(), // 要显示的组件
      {
        row: row,
        className: props.className,
        apiSave: props.apiSave
      }, // 传给组件的 props
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
        onClose: (data) => {
          if (data === 'ok') {
            refresh()
          }
        },
      },
    )
  })
}

function onDelete(row) {
  if(props.apiDelete.startsWith('/')) {
    doHttpDelete(props.apiDelete, queryParams.value, row)
      .then(() => {
        ElMessage.success(t('operationSuccess'))
        refresh()
      })
  } else {
    executeOpenApi(props.apiDelete, queryParams.value, row).then(() => {
      ElMessage.success(t('operationSuccess'))
      refresh()
    })
  }
}

defineExpose({
  queryParams,
  tableColumns,
  tableData,
  loading,
  refresh,
  onView,
  onEdit,
  onAdd,
  onDelete,
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
})
</script>
