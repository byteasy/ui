<template>
  <tuna-container>
    <template v-slot:topBar>
      <tuna-query-bar v-if="props.queryFormVisible !== 0 && tableColumns.length > 0"
                      :query-params="queryParam" :table-props="props" :fields="tableColumns"
                      class="w-full" @refresh="refresh()" @add="onAdd"
                      @moreAction="onMoreActionClick">
        <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
          <slot :name="name" v-bind="slotProps"></slot>
        </template>
      </tuna-query-bar>
    </template>
    <template v-slot:mainContent>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <tuna-table-view
            ref="refTunaTableView"
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
            v-loading="loading"
            :row-key="props.rowKey"
            :tree-props="props.treeProps"
            :default-expand-all="props.defaultExpandAll">
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </tuna-table-view>
          <tuna-card-list-view v-else
                               ref="refTunaTableView"
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
          </tuna-card-list-view>
        </template>
      </el-auto-resizer>
    </template>
    <template v-slot:bottomBar v-if="props.paginationVisible !== 0">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :default-page-size="20"
        :total="parseInt(tableData.total)"
        @change="onPageChange"
      />
    </template>
  </tuna-container>
</template>

<script lang="ts" setup>
import {
  type Component,
  defineEmits,
  defineExpose,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue'
import TunaContainer from '@/components/TunaContainer.vue'
import {doHttpDelete, doHttpGet, getEntitySchema} from '@/api/common/platform'
import {ElMessage, type TableColumnCtx} from 'element-plus'
import {useI18n} from 'vue-i18n'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {putValueIfValid} from "@/util/common.ts";
import BeTableColumnDefine from "@/components/BeTableColumnDefine.vue";
import {getLangText} from "@/locales/common.ts";
import TunaExcelImport from "@/components/TunaExcelImport.vue";
import TunaExcelExport from "@/components/TunaExcelExport.vue";
import {useModal} from "@/components/dialog/useModal.ts";
import TunaTableContainer from "@/components/TunaTableContainer.vue";
import TunaTableForm from "@/components/TunaTableForm.vue";

const appSettingsStore = useAppSettingsStore()
const {t, locale} = useI18n()

const props = defineProps<{
  baseUrl: string
  context: string
  className: string
  titleColumnName?: string
  queryParams?: any
  formWidth?: string | number
  operationColumnWidth?: number
  paginationVisible?: number
  queryFormVisible?: number
  rowDbClick?: (row: any) => void
  excelImportEnable?: boolean
  formComponent?: Component
  excelImportComponent?: Component
  excelExportComponent?: Component
  dialogModel?: any
  rowKey?: string
  defaultExpandAll?: boolean
  treeProps?: object
  showLang?: string
  queryMode?: boolean
  multiple?: boolean
  showSummary?: boolean
  dataRenderFinish?: (tableData) => void
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({total: '0'})
const loading = ref(false)
const viewModel = ref(appSettingsStore.getValue(props.className + '.viewModel') || 'table')
const queryParam = ref({current: 1, size: 20, descColumns: []})
const refTunaTableView = ref(null)
const {open} = useModal()

const mergeQueryParams = () => {
  if (props.queryParams && typeof props.queryParams === 'object') {
    // 使用对象展开运算符合并，props.queryParams 会覆盖默认值
    queryParam.value = {
      ...queryParam.value,
      ...props.queryParams,
    }
  }
}

onBeforeMount(() => {
  loadTableColumns()
})

function loadTableColumns() {
  getEntitySchema(props.context, props.className)
    .then((response) => {
      const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data))
      tableColumns.value = arrs

      mergeQueryParams();
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
  mergeQueryParams()
  refresh()
})

function onPageChange(currentPage, pageSize) {
  queryParam.value.current = currentPage
  queryParam.value.size = pageSize
  refresh()
}

function refresh() {
  loading.value = true
  doHttpGet(props.baseUrl, queryParam.value)
    .then((rsp) => {
      tableData.value = rsp.data
      loading.value = false

      nextTick(() => {
        if (props.dataRenderFinish) {
          props.dataRenderFinish(tableData.value)
        }
      })
    })
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
  return refTunaTableView.value?.getSelectionRows()
}

function toggleRowSelection(row, sel) {
  refTunaTableView.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row) {
  refTunaTableView.value?.setCurrentRow(row)
}

function getFormComponent() {
  if (props.formComponent) {
    return props.formComponent
  } else {
    return TunaTableForm
  }
}

function getFormWidth() {
  return props.formWidth !== undefined ? props.formWidth : undefined
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
      props.excelImportComponent || TunaExcelImport,
      {
        columns: tableColumns.value,
        url: props.baseUrl,
        context: props.context
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
      props.excelExportComponent || TunaExcelExport,
      {
        columns: tableColumns.value,
        url: props.baseUrl,
        queryParam: queryParam.value,
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
        columns: tableColumns.value,
        row: row,
        url: props.baseUrl,
        readonly: true,
        context: props.context,
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
    const params = {}
    params.descColumns = ['updatedTime', 'createdTime']
    params[column.externalClassPrimaryField + 'QueryType'] = 'eq'
    params[column.externalClassPrimaryField] = row[column.innerPrimaryField]
    const query = {}
    query.queryParams = JSON.stringify(params)
    query.className = column.externalClass
    open(
      TunaTableContainer,
      {
        metaData: query,
        dialogModel: props.dialogModel,
      },
      {
        title: getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
      },
    )
  })
}


function onAdd(row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      getFormComponent(), // 要显示的组件
      {columns: tableColumns.value, url: props.baseUrl, context: props.context, row: row}, // 传给组件的 props
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
        columns: tableColumns.value,
        row: row,
        url: props.baseUrl,
        context: props.context,
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
  doHttpDelete(props.baseUrl + '/' + row.id)
    .then(() => {
      ElMessage.success(t('operationSuccess'))
      refresh()
    })
}

defineExpose({
  queryParam,
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
