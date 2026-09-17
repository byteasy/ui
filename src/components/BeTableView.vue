<template>
  <el-table
    fix
    border
    scrollbar-always-on
    stripe
    highlight-current-row
    ref="refElTable"
    @current-change="(row) => currentRow = row"
    @selection-change="handleSelectionChange">
    <!-- 🔥 改造后的智能多选/序号列 -->
    <el-table-column
      type="selection"
      width="55"
      align="center"
      v-if="props.tableProps.multiple === true"
    >
      <template #default="scope">
        <div class="selection-cell-wrapper" :class="{ 'is-selected': isRowSelected(scope.row) }">
          <!-- 默认常态显示：行号 -->
          <span class="row-index-text">{{ scope.$index + 1 }}</span>
          <!-- 鼠标 Hover 或勾选时显示：复选框 -->
          <el-checkbox
            :model-value="isRowSelected(scope.row)"
            @change="(val: boolean) => toggleRowSelection(scope.row, val)"
            @click.stop
            class="row-checkbox-btn"
          />
        </div>
      </template>
    </el-table-column>

    <template v-for="col in fields" :key="col.name">
      <slot :name="'table-column-def-' + col.name" :column="col">
        <el-table-column
          :align="
            col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
          "
          :fixed="col.isFixed === 'YES'"
          :label="getLangText(col.displayName, locale)"
          :prop="col.name"
          resizable
          v-if="col.isShow === 'YES' && (col.type !== 'ENUM' || col.columnComponent)"
          :min-width="col.width === 0 ? undefined : col.width"
          :show-overflow-tooltip="col.isOverflow === 'YES'"
          :sortable="col.isSort === 'YES'"
        >
          <template #default="scope">
            <slot :name="'table-cell-' + col.name" :row="scope.row">
              <el-link underline="never" type="primary" v-if="col.relationType === 'DETAIL_TABLE'">
                <be-i18n-value :model-value="scope.row[col.name] || col.displayName"
                               :lang="props.tableProps.showLang"
                               @click="handleRowAction('detailTable', { column: col, row: scope.row})"/>
              </el-link>
              <be-popup-object-view :model-value="scope.row[getClassFieldName(col.externalClass)]"
                                    :column="col" :lang="props.tableProps.showLang"
                                    v-else-if="col.relationType === 'EXTERNAL_KEY' && col.externalClassAutoFill === true"/>
              <component v-else-if="col.columnComponent"
                         :is="getComponent('..' + parseComponent(col.columnComponent))"
                         :param="parseComponentParam(col.columnComponent)"
                         :model-value="scope.row[col.name]" :row="scope.row" :column="col"
                         :lang="props.tableProps.showLang" @refresh="emit('refresh')"></component>
              <be-i18n-value v-else-if="col.isI18n === 'YES'" :model-value="scope.row[col.name]"
                             :lang="props.tableProps.showLang"/>
              <el-switch v-model="scope.row[col.name]" v-else-if="col.type === 'BOOL'" disabled>
                <template #active-action>
                  <span>T</span>
                </template>
                <template #inactive-action>
                  <span>F</span>
                </template>
              </el-switch>
              <span v-else>{{ scope.row[col.name] }}</span>
            </slot>
          </template>
        </el-table-column>
        <be-enum-column
          :align="col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'"
          :code="col.typeClassName"
          :context="props.tableProps.context"
          :fixed="col.isFixed === 'YES'"
          :label="getLangText(col.displayName, locale)"
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
      v-if="props.tableProps.queryMode !== true"
      align="center"
      :min-width="props.tableProps.operationColumnWidth ? props.tableProps.operationColumnWidth : 160"
    >
      <template #default="scope">
        <el-space direction="horizontal" :size="4">
          <slot name="table-operation" :row="scope.row" :queryParams="props.queryParams">
            <be-popup-object-view :model-value="scope.row"
                                  :column="{ externalClass: props.tableProps.className }"
                                  :lang="props.tableProps.showLang">
              <template v-slot:reference>
                {{ t('table.view') }}
              </template>
            </be-popup-object-view>
            <el-link underline="never" @click="handleRowAction(TableRowActionEnum.EDIT, scope.row)"
                     type="primary" v-if="hasPermission(tableProps.apiSave)">
              {{ t('table.edit') }}
            </el-link>
            <slot name="table-operation-extra" :row="scope.row" :queryParams="props.queryParams"></slot>
            <el-popconfirm
              :confirm-button-text="$t('ok')"
              :cancel-button-text="$t('cancel')"
              :title="$t('deleteWarn')"
              :hide-after="10"
              v-if="hasPermission(tableProps.apiDelete)"
              @confirm="handleRowAction(TableRowActionEnum.DELETE, scope.row)"
            >
              <template #reference>
                <el-link underline="never" type="danger" v-if="hasPermission(tableProps.apiDelete)">
                  {{ t('table.delete') }}
                </el-link>
              </template>
            </el-popconfirm>
            <slot name="table-operation-end-extra" :row="scope.row" :queryParams="props.queryParams"></slot>
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
import {getClassFieldName, parseComponent, parseComponentParam} from "@/util/common.ts";
import {getComponent} from "@/util/componentLoader.ts";
import {type BeTableProps, TableRowActionEnum} from "@/components/BeTable.ts";
import { useSessionStore } from '@/stores/session.ts';

const refElTable = ref<any>(null)
const {t, locale} = useI18n()
const currentRow = ref(undefined)
// 维护当前选中的所有行集合
const selectedRows = ref<any[]>([])
const { hasPermission } = useSessionStore();

const props = defineProps<{
  tableProps: BeTableProps,
  fields: Array<any>
  queryParams?: Record<string, any>
}>()

const emit = defineEmits(['rowAction', 'refresh', 'selection-change'])

function handleRowAction(action: string, args: any) {
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
