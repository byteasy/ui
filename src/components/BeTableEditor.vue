<template>
  <el-table fix border scrollbar-always-on stripe :data="tableData"
            highlight-current-row ref="refElTable" @current-change="(row) => currentRow = row"
            @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center"
                     v-if="props.tableProps.multiple === true">
      <template #default="scope">
        <div class="selection-cell-wrapper" :class="{ 'is-selected': isRowSelected(scope.row) }">
          <span class="row-index-text">{{ scope.$index + 1 }}</span>
          <el-checkbox :model-value="isRowSelected(scope.row)"
                       @change="(val: boolean) => toggleRowSelection(scope.row, val)"
                       @click.stop
                       class="row-checkbox-btn"/>
        </div>
      </template>
    </el-table-column>

    <template v-for="col in props.fields" :key="col.name">
      <el-table-column v-if="col.isForm === 'YES'" :label="getLangText(col.displayName, locale)">
        <template #default="scope">
          <component :is="getComponent(parseComponent(col.fieldComponent))"
                     :param="parseComponentParam(col.fieldComponent)"
                     :formModel="scope.row" v-if="col.fieldComponent"
                     :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
                     :column="col" clearable type="form" v-model="scope.row[col.name]"/>
          <be-form-field v-else :column="col"
                         :placeholder="getLangText(col.displayName, locale)"
                         clearable :formModel="scope.row" v-model="scope.row[col.name]"
                         @clear="scope.row[col.name] = null">
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </be-form-field>
          <div class="error-tip">
          </div>
        </template>
      </el-table-column>
    </template>

    <el-table-column fixed="right" :label="$t('table.operation')"
                     v-if="props.tableProps.queryMode !== true" align="center" width="80">
      <template #default="scope">
        <el-space direction="horizontal" :size="4">
          <slot name="table-editor-operation" :row="scope.row">
            <slot name="table-editor-operation-extra" :row="scope.row"></slot>
            <el-popconfirm
              :confirm-button-text="$t('ok')"
              :cancel-button-text="$t('cancel')"
              :title="$t('deleteWarn')"
              :hide-after="10"
              @confirm="removeLocalRow(scope.row, scope.$index)"
            >
              <template #reference>
                <el-link underline="never" type="danger">
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
import {type BeTableProps, TableRowActionEnum} from "@/components/BeTable.ts";

const refElTable = ref<any>(null)
const tableData = defineModel<any>('tableData', {default: () => ({})})
const {t, locale} = useI18n()
const currentRow = ref(undefined)
// 维护当前选中的所有行集合
const selectedRows = ref<any[]>([])

const props = defineProps<{
  tableProps: BeTableProps,
  fields: Array<any>
}>()

const emit = defineEmits(['rowAction', 'refresh', 'selection-change'])

function handleRowAction(action: TableRowActionEnum, args: any) {
  emit('rowAction', action, args)
}

/**
 * 监听 Element Plus 原生选择变化
 */
function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection
  emit('selection-change', selection)
}

/**
 * 判断某一行是否被勾选（支持有 rowKey 和 无 rowKey 对象比对）
 */
function isRowSelected(row: any) {
  if (!row || selectedRows.value.length === 0) return false
  const rowKey = props.tableProps.rowKey || 'id'
  if (row[rowKey] !== undefined) {
    return selectedRows.value.some(item => item[rowKey] === row[rowKey])
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
 * 从前端绑定的 tableData 数组中移除对应行
 */
function removeLocalRow(row: any, index: number) {
  if (!Array.isArray(tableData.value)) return

  // 优先按 index 删除，如果对象不匹配则通过 indexOf 准确定位
  if (tableData.value[index] === row) {
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
  // 清理当前行状态
  if (currentRow.value === row) {
    currentRow.value = undefined
  }
}

defineExpose({
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
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
