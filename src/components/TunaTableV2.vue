<template>
  <tuna-container>
    <template v-slot:topBar>
      <el-form :inline="true" v-if="props.queryFormVisible !== 0">
        <slot name="from-query">
          <template v-for="col in tableColumns" :key="col.name">
            <el-form-item :label="col.displayName" v-if="col.isSearch === 'YES'">
              <slot :name="'form-query-field-' + col.name" :column="col" :queryParam="queryParam">
                <tuna-query-field
                  :column="col"
                  :context="props.context"
                  :placeholder="col.displayName"
                  v-model="queryParam[col.name]"
                  clearable
                  @change="refresh"
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                />
              </slot>
            </el-form-item>
            <slot name="form-query-extra" :queryParam="queryParam"/>
          </template>
          <el-form-item>
            <slot name="form-query-buttons">
              <el-button type="primary" icon="Search" @click="refresh">{{
                  $t('search')
                }}
              </el-button>
              <el-button type="primary" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
            </slot>
            <slot name="form-query-buttons-extra"></slot>
          </el-form-item>
        </slot>
      </el-form>
    </template>
    <template v-slot:mainContent>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table
            :height="height"
            :data="tableData.records"
            fix
            border
            scrollbar-always-on
            @row-dblclick="onTableRowDoubleClick"
            @row-click="onTableRowClick"
            v-loading="loading"
            highlight-current-row
            @header-dragend="onHeaderDrag"
          >
            <template v-for="col in tableColumns" :key="col.name">
              <slot :name="'table-column-def-' + col.name" :column="col">
                <el-table-column
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                  :fixed="col.isFixed === 'YES'"
                  :label="col.displayName"
                  :prop="col.name"
                  stripe
                  highlight-current-row
                  resizable
                  v-if="col.isShow === 'YES' && col.type !== 'ENUM'"
                  :min-width="col.width === 0 ? undefined : col.width"
                  :show-overflow-tooltip="col.isOverflow === 'YES'"
                >
                  <template #default="scope">
                    <slot :name="'table-cell-' + col.name" :row="scope.row">{{
                        scope.row[col.name]
                      }}
                    </slot>
                  </template>
                </el-table-column>
                <enum-column
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                  :code="col.typeClassName"
                  :context="props.context"
                  :fixed="col.isFixed === 'YES'"
                  :label="col.displayName"
                  :prop="col.name"
                  v-if="col.isShow === 'YES' && col.type === 'ENUM'"
                  :min-width="col.width === 0 ? undefined : col.width"
                  :show-overflow-tooltip="col.isOverflow === 'YES'"
                />
              </slot>
            </template>
            <el-table-column
              fixed="right"
              :label="$t('table.operation')"
              v-if="props.operationColumnWidth !== 0"
              align="center"
              :min-width="props.operationColumnWidth ? props.operationColumnWidth : 160"
            >
              <template #header>
                <div class="flex-row align-items-center w-full">
                  <div class="flex-grow"></div>
                  <div class="flex-none">
                    {{ $t('table.operation') }}
                  </div>
                  <div class="flex-grow flex-row justify-content-end">
                    <el-dropdown placement="bottom-start">
                      <el-button icon="More" circle text/>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-icon>
                              <List/>
                            </el-icon>
                            {{ $t('table.viewModel') }}
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-icon>
                              <SetUp/>
                            </el-icon>
                            {{ $t('table.customColumn') }}
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-icon>
                              <DCaret/>
                            </el-icon>
                            {{ $t('table.customSort') }}
                          </el-dropdown-item>
                          <el-dropdown-item divided @click="downLoadExcelTemplate"
                                            v-if="props.excelImportEnable === true">
                            <el-icon>
                              <Download/>
                            </el-icon>
                            {{ $t('table.downLoadExcelTemplate') }}
                          </el-dropdown-item>
                          <el-dropdown-item @click="onExcelImportClick"
                                            v-if="props.excelImportEnable === true">
                            <el-icon>
                              <IconLocalExcel/>
                            </el-icon>
                            {{ $t('table.importByExcel') }}
                          </el-dropdown-item>
                          <el-dropdown-item v-if="props.excelImportEnable === true">
                            <el-icon>
                              <IconLocalExcelExport/>
                            </el-icon>
                            {{ $t('table.exportToExcel') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </template>
              <template #default="scope">
                <slot name="table-operation" :row="scope.row">
                  <el-link underline="never" @click="onView(scope.row)" type="primary" class="pl-1">
                    {{ t('table.view') }}
                  </el-link>
                  <el-link underline="never" @click="onEdit(scope.row)" type="primary" class="pl-1">
                    {{ t('table.edit') }}
                  </el-link>
                  <slot name="table-operation-extra" :row="scope.row"></slot>
                  <el-popconfirm
                    :confirm-button-text="$t('ok')"
                    :cancel-button-text="$t('cancel')"
                    :title="$t('deleteWarn')"
                    :hide-after="10"
                    @confirm="onDelete(scope.row)"
                  >
                    <template #reference>
                      <el-link underline="never" type="danger" class="pl-1">{{
                          t('table.delete')
                        }}
                      </el-link>
                    </template>
                  </el-popconfirm>
                  <slot name="table-operation-end-extra" :row="scope.row"></slot>
                </slot>
              </template>
            </el-table-column>
          </el-table>
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
import {
  type Component,
  onBeforeMount,
  onMounted,
  ref,
  defineExpose,
  defineEmits,
} from 'vue'
import TunaContainer from '@/components/TunaContainer.vue'
import {doHttpDelete, doHttpGet, getEntitySchema} from '@/api/common/platform'
import {ElMessage, type TableColumnCtx} from 'element-plus'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useModal} from '@/components/dialog/useModal.ts'
import TunaTableForm from '@/components/TunaTableForm.vue'
import TunaExcelImport from '@/components/TunaExcelImport.vue'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {putValueIfValid} from "@/util/common.ts";

const appSettingsStore = useAppSettingsStore()
const route = useRoute()
const {t} = useI18n() // 表单引用

const props = defineProps<{
  baseUrl: string
  context: string
  className: string
  queryParams?: any
  formComponent?: Component
  formWidth?: string | number
  operationColumnWidth?: number
  paginationVisible?: number
  queryFormVisible?: number
  rowDbClick?: (row: any) => void
  excelImportEnable?: boolean
  excelImportComponent?: Component
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({total: '0'})
const loading = ref(false)
const queryParam = ref({current: 1, size: 20, descColumns: []})
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
  const fieldsDefine = appSettingsStore.getStorageObject(props.className + '.fields')
  getEntitySchema(props.context, props.className)
    .then((response) => {
      tableColumns.value = response.data
      if (fieldsDefine !== undefined) {
        tableColumns.value.forEach((column) => {
          if (fieldsDefine[column.name] !== undefined) {
            const fieldCustomDefine = fieldsDefine[column.name]
            console.log(props.className, 'customFieldDefine', fieldCustomDefine)
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
      mergeQueryParams();
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('table.loadingTableColumnsError'))
    })
})

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

function downLoadExcelTemplate() {
  window.open(props.baseUrl + '/excel/template', '_blank')
}

function onExcelImportClick() {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getExcelImportComponent(),
    {
      columns: tableColumns.value,
      url: props.baseUrl,
      context: props.context
    }, // 传给组件的 props
    {
      title: t('table.importByExcel') + '>' + (lastRoute !== undefined ? lastRoute.meta.title : ''),
      width: getFormWidth(),
      onClose: (data) => {
        refresh()
      }
    }
  )
}

function getFormComponent() {
  if (props.formComponent) {
    return props.formComponent
  } else {
    return TunaTableForm
  }
}

function getExcelImportComponent() {
  if (props.excelImportComponent) {
    return props.excelImportComponent
  } else {
    return TunaExcelImport
  }
}

function onView(row) {
  const [lastRoute] = route.matched.slice(-1)
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
      title: t('table.view') + (lastRoute !== undefined ? lastRoute.meta.title : ''),
      width: getFormWidth(),
      onClose: (data) => {
      },
    },
  )
}

function onAdd(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getFormComponent(), // 要显示的组件
    {columns: tableColumns.value, url: props.baseUrl, context: props.context, row: row}, // 传给组件的 props
    {
      title: t('add') + (lastRoute !== undefined ? lastRoute.meta.title : ''),
      width: getFormWidth(),
      onClose: (data) => {
        refresh()
      },
    },
  )
}

function onEdit(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getFormComponent(), // 要显示的组件
    {
      columns: tableColumns.value,
      row: row,
      url: props.baseUrl,
      context: props.context,
    }, // 传给组件的 props
    {
      title: t('table.edit') + (lastRoute !== undefined ? lastRoute.meta.title : ''),
      width: getFormWidth(),
      onClose: (data) => {
        refresh()
      },
    },
  )
}

function onDelete(row) {
  doHttpDelete(props.baseUrl + '/' + row.id)
    .then((rsp) => {
      ElMessage.success(t('operationSuccess'))
      refresh()
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('operationFailed'))
    })
}

function getFormWidth() {
  return props.formWidth !== undefined ? props.formWidth : '50%'
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
