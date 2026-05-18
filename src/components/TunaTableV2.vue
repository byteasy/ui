<template>
  <tuna-container>
    <template v-slot:topBar>
      <el-form :inline="true" v-if="props.queryFormVisible !== 0">
        <slot name="from-query">
          <template v-for="col in tableColumns" :key="col.name">
            <el-form-item :label="getLangText(col.displayName, locale)"
                          v-if="col.isSearch === 'YES'">
              <slot :name="'form-query-field-' + col.name" :column="col" :queryParam="queryParam">
                <tuna-query-field
                  :column="col"
                  :context="props.context"
                  :placeholder="getLangText(col.displayName, locale)"
                  v-model="queryParam[col.name]"
                  clearable
                  @change="refresh"
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                />
              </slot>
            </el-form-item>
          </template>
          <slot name="form-query-extra" :queryParam="queryParam"/>
          <el-form-item>
            <slot name="form-query-buttons">
              <el-button type="primary" icon="Search" @click="refresh">{{
                  $t('search')
                }}
              </el-button>
              <el-button type="primary" @click="onAdd" icon="Plus"
                         v-permission="props.className + '.Add'">{{ $t('add') }}
              </el-button>
            </slot>
            <slot name="form-query-buttons-extra"></slot>
          </el-form-item>
        </slot>
      </el-form>
    </template>
    <template v-slot:mainContent>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <tuna-table-view
            ref="refTunaTableView"
            v-if="viewModel === 'table'"
            :show-lang="props.showLang"
            :context="props.context"
            :form-component="props.formComponent"
            :dialog-model="props.dialogModel"
            :class-name="props.className"
            :form-width="props.formWidth"
            :excel-import-enable="props.excelImportEnable"
            :operation-column-width="props.operationColumnWidth"
            :excel-import-component="props.excelImportComponent"
            :base-url="props.baseUrl"
            :table-columns="tableColumns"
            :loadTableColumns="loadTableColumns"
            :height="height"
            :refresh="refresh"
            :data="tableData.records"
            @row-dblclick="onTableRowDoubleClick"
            @row-click="onTableRowClick"
            v-loading="loading"
            :row-key="props.rowKey"
            :tree-props="props.treeProps"
            :default-expand-all="props.defaultExpandAll"
            @header-dragend="onHeaderDrag"
            @switch-view="switchViewModel"
            :query-param="queryParam"
          >
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </tuna-table-view>
          <tuna-card-list-view v-else
                               ref="refTunaTableView"
                               :width="width"
                               :title-column-name="props.titleColumnName"
                               :show-lang="props.showLang"
                               :context="props.context"
                               :form-component="props.formComponent"
                               :dialog-model="props.dialogModel"
                               :class-name="props.className"
                               :form-width="props.formWidth"
                               :excel-import-enable="props.excelImportEnable"
                               :operation-column-width="props.operationColumnWidth"
                               :excel-import-component="props.excelImportComponent"
                               :base-url="props.baseUrl"
                               :table-columns="tableColumns"
                               :loadTableColumns="loadTableColumns"
                               :height="height"
                               :refresh="refresh"
                               :data="tableData.records"
                               @row-dblclick="onTableRowDoubleClick"
                               @row-click="onTableRowClick"
                               v-loading="loading"
                               :row-key="props.rowKey"
                               :tree-props="props.treeProps"
                               :default-expand-all="props.defaultExpandAll"
                               @header-dragend="onHeaderDrag"
                               @switch-view="switchViewModel"
                               :query-param="queryParam"
          >
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </tuna-card-list-view>
        </template
        >
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
import {type Component, defineEmits, defineExpose, onBeforeMount, onMounted, ref,} from 'vue'
import TunaContainer from '@/components/TunaContainer.vue'
import {doHttpGet, getEntitySchema} from '@/api/common/platform'
import {ElMessage, type TableColumnCtx} from 'element-plus'
import {useI18n} from 'vue-i18n'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {putValueIfValid} from "@/util/common.ts";
import {getLangText} from "@/locales/common.ts";

const appSettingsStore = useAppSettingsStore()
const {t, locale} = useI18n()

const props = defineProps<{
  baseUrl: string
  context: string
  className: string
  titleColumnName?: string
  queryParams?: any
  formComponent?: Component
  formWidth?: string | number
  operationColumnWidth?: number
  paginationVisible?: number
  queryFormVisible?: number
  rowDbClick?: (row: any) => void
  excelImportEnable?: boolean
  excelImportComponent?: Component
  dialogModel?: any
  rowKey?: string
  defaultExpandAll?: boolean
  treeProps?: object
  showLang?: string
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({total: '0'})
const loading = ref(false)
const viewModel = ref(appSettingsStore.getValue(props.className + '.viewModel') || 'table')
const queryParam = ref({current: 1, size: 20, descColumns: []})
const refTunaTableView = ref(null)

function switchViewModel() {
  if(viewModel.value === 'table') {
    viewModel.value = 'cardList'
  } else {
    viewModel.value = 'table'
  }
  appSettingsStore.putValue(props.className + '.viewModel', viewModel.value)
}

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
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('table.loadingTableDataError'))
    })
}

function onView(row) {
  refTunaTableView.value?.onView(row)
}

function onAdd(row) {
  refTunaTableView.value?.onAdd(row)
}

function onEdit(row) {
  refTunaTableView.value?.onEdit(row)
}

function onDelete(row) {
  refTunaTableView.value?.onDelete(row)
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
  console.log(column, column.property, 'newWidth', newWidth)
  appSettingsStore.putStorageObject(props.className + '.fields', fieldsDefine)
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
  onDelete
})
</script>
