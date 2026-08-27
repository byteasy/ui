<template>
  <el-table
    fix
    border
    scrollbar-always-on
    stripe
    :data="tableData"
    :row-key="getRowKey"
    highlight-current-row
    ref="refElTable"
    @current-change="(row) => (currentRow = row)"
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
        <template #header v-if="col.isRequire === 'YES'">
          <span style="color: var(--el-color-danger)">*</span>
          {{ getLangText(col.displayName, locale) }}
        </template>

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
            <slot
              name="table-editor-operation-extra"
              :row="scope.row"
              :$index="scope.$index"
            ></slot>
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
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
import { defineEmits, defineExpose, ref, toRaw } from 'vue';
import { parseComponent, parseComponentParam } from '@/util/common.ts';
import { getComponent } from '@/util/componentLoader.ts';
import { type BeColumn, type BeTableProps } from '@/components/BeTable.ts';
import { ElMessage } from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';

const refElTable = ref<any>(null);
const tableData = defineModel<any[]>('tableData', { default: () => [] });
const { t, locale } = useI18n();
const currentRow = ref(undefined);
// 维护当前选中的所有行集合
const selectedRows = ref<any[]>([]);

const props = defineProps<{
  tableProps: BeTableProps;
  fields: Array<BeColumn>;
}>();
const emit = defineEmits(['rowAction', 'refresh', 'selection-change']);

/**
 * 获取主键字段名
 */
function getPrimaryFieldName(): string {
  const primaryCol = props.fields?.find((f) => f.isPrimary === 'YES');
  return primaryCol?.name || props.tableProps.rowKey || 'id';
}

/**
 * 获取行的唯一 key（如果数据库主键为空，则取前端临时生成的 _rowKey）
 */
function getRowKey(row: any): string {
  const primaryField = getPrimaryFieldName();
  if (
    row &&
    row[primaryField] !== undefined &&
    row[primaryField] !== null &&
    row[primaryField] !== ''
  ) {
    return String(row[primaryField]);
  }
  if (!row._rowKey) {
    row._rowKey = 'row_' + Math.random().toString(36).slice(2, 10);
  }
  return row._rowKey;
}

/**
 * 监听 Element Plus 原生选择变化
 */
function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection;
  emit('selection-change', selection);
}

/**
 * 判断某一行是否被勾选（支持主键比对、_rowKey 比对与对象代理比对）
 */
function isRowSelected(row: any) {
  if (!row || selectedRows.value.length === 0) return false;
  const primaryField = getPrimaryFieldName();
  const rowId = row[primaryField];

  if (rowId !== undefined && rowId !== null && rowId !== '') {
    return selectedRows.value.some((item) => item[primaryField] === rowId);
  }
  if (row._rowKey) {
    return selectedRows.value.some((item) => item._rowKey === row._rowKey);
  }

  const rawTarget = toRaw(row);
  return selectedRows.value.some((item) => item === row || toRaw(item) === rawTarget);
}

function getSelectionRows() {
  if (props.tableProps.multiple === true) {
    return refElTable.value?.getSelectionRows() || selectedRows.value;
  } else {
    return currentRow.value !== undefined ? [currentRow.value] : [];
  }
}

function toggleRowSelection(row: any, sel?: boolean) {
  return refElTable.value?.toggleRowSelection(row, sel);
}

function setCurrentRow(row: any) {
  refElTable.value?.setCurrentRow(row);
}

/**
 * 纯前端内存删除单行（使用 splice 原地操作）
 */
function spliceLocalRow(row: any, index?: number) {
  if (!Array.isArray(tableData.value)) return;

  if (typeof index === 'number' && tableData.value[index] === row) {
    tableData.value.splice(index, 1);
  } else {
    const rawTarget = toRaw(row);
    const targetIndex = tableData.value.findIndex(
      (item) => item === row || toRaw(item) === rawTarget,
    );
    if (targetIndex !== -1) {
      tableData.value.splice(targetIndex, 1);
    }
  }

  // 同步清理选中态
  if (selectedRows.value.length > 0) {
    const rawTarget = toRaw(row);
    selectedRows.value = selectedRows.value.filter(
      (item) => item !== row && toRaw(item) !== rawTarget,
    );
  }
  // 清理当前高亮行
  if (currentRow.value === row || (currentRow.value && toRaw(currentRow.value) === toRaw(row))) {
    currentRow.value = undefined;
  }
}

/**
 * 单行删除
 */
async function removeLocalRow(row: any, index?: number) {
  const primaryField = getPrimaryFieldName();
  const primaryVal = row?.[primaryField];
  const hasPrimaryValue = primaryVal !== undefined && primaryVal !== null && primaryVal !== '';

  if (hasPrimaryValue && props.tableProps.apiDelete) {
    try {
      row._deleting = true;
      await executeOpenApi(
        props.tableProps.apiDelete,
        {
          className: props.tableProps.className,
          [primaryField]: primaryVal,
          id: primaryVal,
        },
        {},
      );

      ElMessage.success(t('operationSuccess') || '删除成功');
      spliceLocalRow(row, index);
      emit('refresh');
    } catch (err: any) {
      ElMessage.error(err?.message || '删除失败');
    } finally {
      if (row) row._deleting = false;
    }
  } else {
    spliceLocalRow(row, index);
  }
}

/**
 * 🔥 核心修复：批量删除函数（采用 splice 倒序原地删除，不破坏数组引用）
 */
const batchRemove = (rows?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // 1. 获取目标行集合
    const targetRows = rows && rows.length > 0 ? rows : getSelectionRows();

    if (!targetRows || targetRows.length === 0) {
      resolve([]);
      return;
    }

    if (!Array.isArray(tableData.value) || tableData.value.length === 0) {
      resolve([]);
      return;
    }

    const primaryField = getPrimaryFieldName();

    // 2. 筛选出具有真实后端主键的行
    const rowsWithPrimary = targetRows.filter((row) => {
      const val = row?.[primaryField];
      return val !== undefined && val !== null && val !== '';
    });

    // 🔥 核心：采用 splice 倒序原地修改 tableData.value，绝不产生新数组引用
    const executeLocalBatchFilter = () => {
      const rawTargetList = targetRows.map((r) => toRaw(r));
      const targetSet = new Set([...targetRows, ...rawTargetList]);

      const targetKeySet = new Set(rowsWithPrimary.map((item) => String(item[primaryField])));
      const targetRowKeySet = new Set(targetRows.map((item) => item._rowKey).filter(Boolean));

      // 倒序 splice 删除
      for (let i = tableData.value.length - 1; i >= 0; i--) {
        const item = tableData.value[i];
        const rawItem = toRaw(item);
        const itemPrimary = item?.[primaryField];
        const hasPrimary = itemPrimary !== undefined && itemPrimary !== null && itemPrimary !== '';

        const isMatch =
          targetSet.has(item) ||
          targetSet.has(rawItem) ||
          (hasPrimary && targetKeySet.has(String(itemPrimary))) ||
          (item._rowKey && targetRowKeySet.has(item._rowKey));

        if (isMatch) {
          tableData.value.splice(i, 1);
        }
      }

      // 重置选中状态与高亮行
      selectedRows.value = [];
      refElTable.value?.clearSelection();
      currentRow.value = undefined;

      emit('selection-change', []);
      resolve(targetRows);
    };

    // 场景 A：存在后端持久化主键 且 配置了批量删除 API
    if (rowsWithPrimary.length > 0 && props.tableProps.apiBatchDelete) {
      executeOpenApi(props.tableProps.apiBatchDelete, {}, rowsWithPrimary)
        .then(() => {
          executeLocalBatchFilter();
        })
        .catch((err) => {
          ElMessage.error(err?.message || '批量删除失败');
          reject(err);
        });
    } else {
      // 场景 B：纯草稿行或未配置批量删除接口 -> 前端原地移除
      executeLocalBatchFilter();
    }
  });
};

const save = () => {
  return new Promise((resolve, reject) => {
    if (!props.tableProps.apiImportBatchSave) {
      reject('apiImportBatchSave not available');
      return;
    }
    executeOpenApi(props.tableProps.apiImportBatchSave, {}, tableData.value)
      .then(() => {
        ElMessage.success(t('operationSuccess') || '保存成功');
        resolve(tableData.value);
      })
      .catch((err) => {
        ElMessage.error(err?.message || '保存失败');
        reject(err);
      });
  });
};

/**
 * 🔥 核心修复：添加新行时注入唯一 _rowKey
 */
const addNewRow = (defaultValue: any = {}) => {
  const row = {
    ...defaultValue,
    _rowKey: 'row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
  };
  if (!Array.isArray(tableData.value)) {
    tableData.value = [];
  }
  tableData.value.push(row);
};

defineExpose({
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow,
  removeLocalRow,
  batchRemove,
  save,
  addNewRow,
});
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
