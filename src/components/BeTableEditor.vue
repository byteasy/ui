<template>
  <el-table
    fix
    border
    scrollbar-always-on
    stripe
    :data="tableData"
    highlight-current-row
    ref="refElTable"
    @current-change="(row) => currentRow = row"
    @selection-change="handleSelectionChange"
  >
    <!-- 多选/智能序号列 -->
    <el-table-column
      type="selection"
      width="55"
      align="center"
      v-if="props.tableProps.multiple === true"
    >
      <template #default="scope">
        <div class="selection-cell-wrapper" :class="{ 'is-selected': isRowSelected(scope.row) }">
          <span class="row-index-text">{{ scope.$index + 1 }}</span>
          <el-checkbox
            :model-value="isRowSelected(scope.row)"
            @change="(val: boolean) => toggleRowSelection(scope.row, val)"
            @click.stop
            class="row-checkbox-btn"
          />
        </div>
      </template>
    </el-table-column>

    <!-- 动态表单列渲染 -->
    <template v-for="col in props.fields" :key="col.name">
      <el-table-column v-if="col.isForm === 'YES'" :label="getLangText(col.displayName, locale)">
        <template #default="scope">
          <component
            :is="getComponent(parseComponent(col.fieldComponent))"
            :param="parseComponentParam(col.fieldComponent)"
            :formModel="scope.row"
            v-if="col.fieldComponent"
            :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
            :column="col"
            clearable
            type="form"
            v-model="scope.row[col.name]"
          />
          <be-form-field
            v-else
            :column="col"
            :placeholder="getLangText(col.displayName, locale)"
            clearable
            :formModel="scope.row"
            v-model="scope.row[col.name]"
            @clear="scope.row[col.name] = null"
          >
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </be-form-field>
          <div class="error-tip"></div>
        </template>
      </el-table-column>
    </template>

    <!-- 操作列 -->
    <el-table-column
      fixed="right"
      :label="$t('table.operation')"
      v-if="props.tableProps.queryMode !== true"
      align="center"
      width="80"
    >
      <template #default="scope">
        <el-space direction="horizontal" :size="4">
          <slot name="table-editor-operation" :row="scope.row" :$index="scope.$index">
            <slot name="table-editor-operation-extra" :row="scope.row"
                  :$index="scope.$index"></slot>
            <el-popconfirm
              :confirm-button-text="$t('ok')"
              :cancel-button-text="$t('cancel')"
              :title="$t('deleteWarn')"
              :hide-after="10"
              @confirm="removeLocalRow(scope.row, scope.$index)"
            >
              <template #reference>
                <el-link underline="never" type="danger" :loading="scope.row?._deleting">
                  {{ t('table.delete') }}
                </el-link>
              </template>
            </el-popconfirm>
          </slot>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {defineExpose, ref} from "vue";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
import {getComponent} from "@/util/componentLoader.ts";
import {type BeColumn, type BeTableProps, TableRowActionEnum} from "@/components/BeTable.ts";
import {ElMessage} from "element-plus";
import {executeOpenApi} from "@/api/common/platform";

const refElTable = ref<any>(null)
const tableData = defineModel<any[]>('tableData', {default: () => []})
const {t, locale} = useI18n()
const currentRow = ref(undefined)
// 维护当前选中的所有行集合
const selectedRows = ref<any[]>([])

const props = defineProps<{
  tableProps: BeTableProps,
  fields: Array<BeColumn>
}>()

const emit = defineEmits(['rowAction', 'refresh', 'selection-change', 'rowDelete'])

/**
 * 获取主键字段名（优先取 BeColumn 中 isPrimary === 'YES' 的字段名，未找到则取 rowKey 或 'id'）
 */
function getPrimaryFieldName(): string {
  const primaryCol = props.fields?.find(f => f.isPrimary === 'YES')
  return primaryCol?.name || props.tableProps.rowKey || 'id'
}

/**
 * 监听 Element Plus 原生选择变化
 */
function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection
  emit('selection-change', selection)
}

/**
 * 判断某一行是否被勾选（支持有主键和无主键的对象引用比对）
 */
function isRowSelected(row: any) {
  if (!row || selectedRows.value.length === 0) return false
  const primaryField = getPrimaryFieldName()
  const rowId = row[primaryField]
  if (rowId !== undefined && rowId !== null && rowId !== '') {
    return selectedRows.value.some(item => item[primaryField] === rowId)
  }
  return selectedRows.value.includes(row)
}

function getSelectionRows() {
  if (props.tableProps.multiple === true) {
    return refElTable.value?.getSelectionRows() || selectedRows.value
  } else {
    return currentRow.value !== undefined ? [currentRow.value] : []
  }
}

function toggleRowSelection(row: any, sel?: boolean) {
  return refElTable.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row: any) {
  refElTable.value?.setCurrentRow(row)
}

/**
 * 纯前端内存删除单行公共逻辑
 */
function spliceLocalRow(row: any, index?: number) {
  if (!Array.isArray(tableData.value)) return

  if (typeof index === 'number' && tableData.value[index] === row) {
    tableData.value.splice(index, 1)
  } else {
    const targetIndex = tableData.value.indexOf(row)
    if (targetIndex !== -1) {
      tableData.value.splice(targetIndex, 1)
    }
  }

  // 同步清理选中态
  if (selectedRows.value.length > 0) {
    selectedRows.value = selectedRows.value.filter(item => item !== row)
  }
  // 清理当前高亮行
  if (currentRow.value === row) {
    currentRow.value = undefined
  }

  emit('selection-change', selectedRows.value)
}

/**
 * 🔥 单行删除：如果主键不为空且配置了 apiDelete 则调用后端，否则仅在前端直接删除
 */
async function removeLocalRow(row: any, index?: number) {
  const primaryField = getPrimaryFieldName()
  const primaryVal = row?.[primaryField]
  const hasPrimaryValue = primaryVal !== undefined && primaryVal !== null && primaryVal !== ''

  // 场景 A：主键不为空 且 配置了后端删除接口 -> 调用后端删除
  if (hasPrimaryValue && props.tableProps.apiDelete) {
    try {
      row._deleting = true
      await executeOpenApi(props.tableProps.apiDelete, {
        className: props.tableProps.className,
        [primaryField]: primaryVal,
        id: primaryVal
      }, {})

      ElMessage.success(t('operationSuccess') || '删除成功')
      spliceLocalRow(row, index)
      emit('refresh')
    } catch (err: any) {
      ElMessage.error(err?.message || '删除失败')
    } finally {
      if (row) row._deleting = false
    }
  } else {
    spliceLocalRow(row, index)
  }
}

/**
 * 🔥 批量删除函数：如果选中的行主键全部为空，则完全不调用后端接口
 */
const batchRemove = (rows?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // 1. 获取要删除的行列表
    const targetRows = (rows && rows.length > 0) ? rows : getSelectionRows()

    // 2. 空防御
    if (!targetRows || targetRows.length === 0) {
      resolve([])
      return
    }

    if (!Array.isArray(tableData.value) || tableData.value.length === 0) {
      resolve([])
      return
    }

    const primaryField = getPrimaryFieldName()

    // 3. 区分已入库（有主键）的数据与纯前端草稿（无主键）的数据
    const rowsWithPrimary = targetRows.filter(row => {
      const val = row?.[primaryField]
      return val !== undefined && val !== null && val !== ''
    })

    // 执行前端内存过滤清理的内部公共闭包
    const executeLocalBatchFilter = () => {
      const targetSet = new Set(targetRows)
      const targetKeySet = new Set(rowsWithPrimary.map(item => item[primaryField]))

      tableData.value = tableData.value.filter((row: any) => {
        if (targetSet.has(row)) return false
        if (row?.[primaryField] !== undefined && targetKeySet.has(row[primaryField])) return false
        return true
      })

      // 重置选中态与高亮
      selectedRows.value = []
      refElTable.value?.clearSelection()
      if (currentRow.value && (targetSet.has(currentRow.value) || targetKeySet.has(currentRow.value?.[primaryField]))) {
        currentRow.value = undefined
      }

      emit('selection-change', [])
      resolve(targetRows)
    }

    // 场景 A：有持久化数据 且 配置了批量删除接口 -> 调用后端接口
    if (rowsWithPrimary.length > 0 && props.tableProps.apiBatchDelete) {
      executeOpenApi(props.tableProps.apiBatchDelete, {}, rowsWithPrimary)
        .then(() => {
          executeLocalBatchFilter()
          emit('refresh')
        })
        .catch(err => {
          ElMessage.error(err?.message || '批量删除失败')
          reject(err)
        })
    } else {
      // 场景 B：所有选中的行都没有主键（全是新增未入库的行）或 未配置 apiBatchDelete -> 直接前端移除，不调后端
      executeLocalBatchFilter()
    }
  })
}

const save = () => {
  return new Promise((resolve, reject) => {
    if (!props.tableProps.apiImportBatchSave) {
      reject('apiImportBatchSave not available')
      return
    }
    executeOpenApi(props.tableProps.apiImportBatchSave, {}, tableData.value).then(() => {
      ElMessage.success(t('operationSuccess') || '保存成功')
      resolve(tableData.value)
    }).catch(err => {
      ElMessage.error(err?.message || '保存失败')
      reject(err)
    })
  })
}

const addNewRow = (defaultValue: any = {}) => {
  const row = {...defaultValue}
  tableData.value.push(JSON.parse(JSON.stringify(row)))
}

defineExpose({
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow,
  removeLocalRow,
  batchRemove,
  save,
  addNewRow,
})
</script>

<style scoped>
/* 单元格容器：相对定位 */
.selection-cell-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* 序号文字样式 */
.row-index-text {
  display: inline-block;
  color: var(--el-text-color-secondary, #909399);
  transition: opacity 0.15s ease;
}

/* 复选框样式（默认绝对定位居中，隐藏） */
.row-checkbox-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  margin-right: 0 !important;
}

/* 🌟 核心悬浮逻辑：当表格行 hover 时，隐藏序号，显示复选框 */
:deep(.el-table__row:hover) .selection-cell-wrapper:not(.is-selected) .row-index-text {
  display: none;
}

:deep(.el-table__row:hover) .selection-cell-wrapper:not(.is-selected) .row-checkbox-btn {
  display: inline-flex;
}

/* 🌟 核心勾选常驻逻辑：若当前行已选中，永久隐藏序号并显示复选框 */
.selection-cell-wrapper.is-selected .row-index-text {
  display: none;
}

.selection-cell-wrapper.is-selected .row-checkbox-btn {
  display: inline-flex;
}
</style>
