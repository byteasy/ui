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
    class="be-table-editor"
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
        <!-- 必填红星标识 -->
        <template #header>
          <span v-if="col.isRequire === 'YES'" class="required-star">*</span>
          {{ getLangText(col.displayName, locale) }}
        </template>

        <template #default="scope">
          <div
            class="editor-cell-box"
            :class="{ 'has-error': !!getCellError(scope.row, col.name) }"
          >
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
              @change="() => validateCell(scope.row, col)"
              @blur="() => validateCell(scope.row, col)"
            />
            <be-form-field
              v-else
              :column="col"
              :placeholder="getLangText(col.displayName, locale)"
              clearable
              :formModel="scope.row"
              v-model="scope.row[col.name]"
              @clear="((scope.row[col.name] = null), validateCell(scope.row, col))"
              @change="() => validateCell(scope.row, col)"
              @blur="() => validateCell(scope.row, col)"
            >
              <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
                <slot :name="name" v-bind="slotProps"></slot>
              </template>
            </be-form-field>

            <!-- 错误信息提示气泡/提示文案 -->
            <transition name="el-zoom-in-top">
              <div class="error-tip" v-if="getCellError(scope.row, col.name)">
                {{ getCellError(scope.row, col.name) }}
              </div>
            </transition>
          </div>
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
import { defineEmits, defineExpose, reactive, ref, toRaw } from 'vue';
import { parseComponent, parseComponentParam } from '@/util/common.ts';
import { getComponent } from '@/util/componentLoader.ts';
import { type BeColumn, type BeTableProps } from '@/components/BeTable.ts';
import { ElMessage } from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';
import { validateColumnRule } from '@/util/validateUtils.ts'; // 引入你的校验函数

const refElTable = ref<any>(null);
const tableData = defineModel<any[]>('tableData', { default: () => [] });
const { t, locale } = useI18n();
const currentRow = ref(undefined);
// 维护当前选中的所有行集合
const selectedRows = ref<any[]>([]);

// 维护表格内每个单元格的错误状态字典: key: `${rowKey}_${columnName}` -> errMsg
const errorsMap = reactive<Record<string, string>>({});

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
 * 获取行的唯一 key
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
 * 获取某个单元格的错误信息
 */
function getCellError(row: any, colName: string): string {
  const key = `${getRowKey(row)}_${colName}`;
  return errorsMap[key] || '';
}

/**
 * 单个单元格的实时校验
 */
function validateCell(row: any, col: BeColumn): Promise<boolean> {
  return new Promise((resolve) => {
    const key = `${getRowKey(row)}_${col.name}`;
    const value = row[col.name];

    // 调用封装的规则校验
    validateColumnRule(col, {}, value, locale.value, (error?: Error) => {
      if (error && error.message) {
        errorsMap[key] = error.message;
        resolve(false);
      } else {
        delete errorsMap[key];
        resolve(true);
      }
    });
  });
}

/**
 * 清理指定行的校验错误信息
 */
function clearRowErrors(row: any) {
  const rKey = getRowKey(row);
  Object.keys(errorsMap).forEach((k) => {
    if (k.startsWith(`${rKey}_`)) {
      delete errorsMap[k];
    }
  });
}

/**
 * 🔥 整表全量异步校验函数：遍历所有行与可编辑字段
 */
async function validateTable(): Promise<boolean> {
  if (!Array.isArray(tableData.value) || tableData.value.length === 0) {
    return true;
  }

  const formFields = props.fields.filter((col) => col.isForm === 'YES');
  let isValid = true;
  let firstErrorRow: any = null;

  for (const row of tableData.value) {
    for (const col of formFields) {
      const isCellValid = await validateCell(row, col);
      if (!isCellValid) {
        isValid = false;
        if (!firstErrorRow) {
          firstErrorRow = row;
        }
      }
    }
  }

  if (!isValid) {
    ElMessage.warning(
      t('platform.ebApp.formValidateFailed'),
    );
    if (firstErrorRow) {
      setCurrentRow(firstErrorRow);
    }
  }

  return isValid;
}

/**
 * 监听 Element Plus 原生选择变化
 */
function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection;
  emit('selection-change', selection);
}

/**
 * 判断某一行是否被勾选
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
 * 纯前端内存删除单行
 */
function spliceLocalRow(row: any, index?: number) {
  if (!Array.isArray(tableData.value)) return;

  // 清除该行所有未消的错误信息
  clearRowErrors(row);

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
 * 批量删除函数
 */
const batchRemove = (rows?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
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
    const rowsWithPrimary = targetRows.filter((row) => {
      const val = row?.[primaryField];
      return val !== undefined && val !== null && val !== '';
    });

    const executeLocalBatchFilter = () => {
      const rawTargetList = targetRows.map((r) => toRaw(r));
      const targetSet = new Set([...targetRows, ...rawTargetList]);

      const targetKeySet = new Set(rowsWithPrimary.map((item) => String(item[primaryField])));
      const targetRowKeySet = new Set(targetRows.map((item) => item._rowKey).filter(Boolean));

      // 清除被删除行的校验错误
      targetRows.forEach((r) => clearRowErrors(r));

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

      selectedRows.value = [];
      refElTable.value?.clearSelection();
      currentRow.value = undefined;

      emit('selection-change', []);
      resolve(targetRows);
    };

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
      executeLocalBatchFilter();
    }
  });
};

/**
 * 🔥 完善后的保存逻辑：内置前置校验，校验不通过则拦截保存
 */
const save = () => {
  return new Promise(async (resolve, reject) => {
    // 1. 前置整表校验
    const isPassed = await validateTable();
    if (!isPassed) {
      return;
    }

    // 2. 校验通过，提交保存
    if (!props.tableProps.apiImportBatchSave) {
      reject('apiImportBatchSave not available');
      return;
    }

    if (tableData.value.length < 1) {
      resolve([]);
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
 * 添加新行
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
  validateTable, // 导出整表校验
  validateCell, // 导出单单元格校验
});
</script>

<style scoped>
/* 必填星号 */
.required-star {
  color: var(--el-color-danger, #f56c6c);
  margin-right: 4px;
  font-weight: bold;
}

/* 单元格编辑容器 */
.editor-cell-box {
  position: relative;
  width: 100%;
  padding-bottom: 2px;
}

/* 校验失败时组件高亮红框 */
.editor-cell-box.has-error :deep(.el-input__wrapper),
.editor-cell-box.has-error :deep(.el-select__wrapper),
.editor-cell-box.has-error :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px var(--el-color-danger, #f56c6c) inset !important;
}

/* 错误提示文字 */
.error-tip {
  color: var(--el-color-danger, #f56c6c);
  font-size: 12px;
  line-height: 1.2;
  margin-top: 4px;
  text-align: left;
  word-break: break-all;
}

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

/* 核心悬浮逻辑：当表格行 hover 时，隐藏序号，显示复选框 */
:deep(.el-table__row:hover) .selection-cell-wrapper:not(.is-selected) .row-index-text {
  display: none;
}

:deep(.el-table__row:hover) .selection-cell-wrapper:not(.is-selected) .row-checkbox-btn {
  display: inline-flex;
}

/* 核心勾选常驻逻辑：若当前行已选中，永久隐藏序号并显示复选框 */
.selection-cell-wrapper.is-selected .row-index-text {
  display: none;
}

.selection-cell-wrapper.is-selected .row-checkbox-btn {
  display: inline-flex;
}
</style>
