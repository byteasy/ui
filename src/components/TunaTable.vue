<template>
  <tuna-container>
    <template v-slot:topBar>
      <el-form :inline="true" v-if="props.queryFormVisible !== 0">
        <slot name="formQuery">
          <template v-for="col in tableColumns" :key="col.name">
            <el-form-item :label="col.displayName" v-if="col.isSearch === 'YES'">
              <slot :name="'formItemField_' + col.name" :column="col" :queryParam="queryParam">
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
            <slot name="formItemExt" :queryParam="queryParam" />
          </template>
          <el-form-item>
            <slot name="formQueryButton">
              <el-button type="primary" icon="Search" @click="refresh">{{
                  $t('search')
                }}</el-button>
              <el-button type="primary" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
            </slot>
            <slot name="formQueryButtonExt"></slot>
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
            scrollbar-always-on
            @row-dblclick="onTableRowDoubleClick"
            @row-click="onTableRowClick"
            v-loading="loading"
            highlight-current-row
          >
            <template v-for="col in tableColumns" :key="col.name">
              <slot :name="'columnsSlot_' + col.name" :column="col">
                <el-table-column
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                  :fixed="col.isFixed === 'YES'"
                  :label="col.displayName"
                  :prop="col.name"
                  stripe
                  highlight-current-row
                  v-if="col.isShow === 'YES' && col.type !== 'ENUM'"
                  :min-width="col.width === 0 ? undefined : col.width"
                  :show-overflow-tooltip="col.isOverflow === 'YES'"
                >
                  <template #default="scope">
                    <slot :name="'table_column_' + col.name" :row="scope.row">{{
                        scope.row[col.name]
                      }}</slot>
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
                      <el-button icon="More" circle />
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="downLoadExcelTemplate">
                            {{ $t('table.downLoadExcelTemplate') }}
                          </el-dropdown-item>
                          <el-dropdown-item @click="onExcelImportClick">
                            {{ $t('table.importByExcel') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </template>
              <template #default="scope">
                <slot name="operationSlot" :row="scope.row">
                  <el-button link type="primary" @click="onView(scope.row)">{{
                      t('table.view')
                    }}</el-button>
                  <el-button link type="primary" @click="onEdit(scope.row)">
                    {{ t('table.edit') }}
                  </el-button>
                  <el-popconfirm
                    :confirm-button-text="$t('ok')"
                    :cancel-button-text="$t('cancel')"
                    :title="$t('deleteWarn')"
                    :hide-after="10"
                    @confirm="onDelete(scope.row)"
                  >
                    <template #reference>
                      <el-button link type="danger">
                        {{ t('table.delete') }}
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <slot name="operationSlotExt" :row="scope.row"> </slot>
                </slot>
              </template>
            </el-table-column>
          </el-table> </template
        ></el-auto-resizer>
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
import { doHttpDelete, doHttpGet, getEntitySchema } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useModal } from '@/components/dialog/useModal.ts'
import TunaTableForm from '@/components/TunaTableForm.vue'
import TunaExcelImport from '@/components/TunaExcelImport.vue'

const route = useRoute()
const { t } = useI18n() // 表单引用

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
  rowDbClick?: (row : any) => void
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({ total: '0' })
const loading = ref(false)
const queryParam = ref({ current: 1, size: 20, descColumns: [] })
const { open } = useModal()

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
  getEntitySchema(props.context, props.className)
    .then((response) => {
      tableColumns.value = response.data
      mergeQueryParams()
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
    TunaExcelImport,
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
      onClose: (data) => {},
    },
  )
}
function onAdd(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getFormComponent(), // 要显示的组件
    { columns: tableColumns.value, url: props.baseUrl, context: props.context, row: row }, // 传给组件的 props
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
    onEdit(row)
  }
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
