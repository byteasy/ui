<template>
  <el-table fix border scrollbar-always-on stripe highlight-current-row ref="refElTable"
            @current-change="(row) => currentRow = row">
    <el-table-column type="selection" width="55"
                     v-if="props.tableProps.queryMode === true && props.tableProps.multiple === true"/>
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
                <be-i18n-value :model-value="scope.row[col.name]"
                                 :lang="props.tableProps.showLang"
                                 @click="handleRowAction('detailTable', { column: col, row: scope.row})"/>
              </el-link>
              <be-popup-object-view :model-value="scope.row[getClassFieldName(col.externalClass)]" :column="col" :lang="props.tableProps.showLang" v-else-if="col.relationType === 'EXTERNAL_KEY'"/>
              <component v-else-if="col.columnComponent"
                         :is="getComponent('..' + parseComponent(col.columnComponent))"
                         :param="parseComponentParam(col.columnComponent)"
                         :model-value="scope.row[col.name]" :row="scope.row" :column="col" :lang="props.tableProps.showLang"></component>
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
          :align=" col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'"
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
      v-if="props.tableProps.operationColumnWidth !== 0 && props.tableProps.queryMode !== true"
      align="center"
      :min-width="props.tableProps.operationColumnWidth ? props.tableProps.operationColumnWidth : 160"
    >
      <template #default="scope">
        <el-space direction="horizontal" :size="4">
          <slot name="table-operation" :row="scope.row">
            <be-popup-object-view :model-value="scope.row"
                                    :column="{ externalClass: props.tableProps.className }"
                                    :lang="props.tableProps.showLang">
              <template v-slot:reference>
                {{ t('table.view') }}
              </template>
            </be-popup-object-view>
            <el-link underline="never" @click="handleRowAction('edit', scope.row)" type="primary"
                     >
              {{ t('table.edit') }}
            </el-link>
            <slot name="table-operation-extra" :row="scope.row"></slot>
            <el-popconfirm
              :confirm-button-text="$t('ok')"
              :cancel-button-text="$t('cancel')"
              :title="$t('deleteWarn')"
              :hide-after="10"
              @confirm="handleRowAction('delete', scope.row)"
            >
              <template #reference>
                <el-link underline="never" type="danger">
                  {{ t('table.delete') }}
                </el-link>
              </template>
            </el-popconfirm>
            <slot name="table-operation-end-extra" :row="scope.row"></slot>
          </slot>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {type Component, defineExpose, ref} from "vue";
import {getClassFieldName, parseComponent, parseComponentParam} from "@/util/common.ts";
import {getRouteComponents} from "@/util/autoImportComponent.ts";

const refElTable = ref(null)
const {t, locale} = useI18n()
const currentRow = ref(undefined)
const {modules} = getRouteComponents()

const props = defineProps<{
  tableProps: {
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
  },
  fields: Array<object>
}>()

const emit = defineEmits(['rowAction'])

function getComponent(path) {
  return modules[path]
}

function handleRowAction(action, args) {
  emit('rowAction', action, args)
}

function getSelectionRows() {
  if (props.tableProps.multiple === true) {
    return refElTable.value?.getSelectionRows()
  } else {
    if (currentRow.value !== undefined) {
      return [currentRow.value]
    } else {
      return []
    }
  }
}

function toggleRowSelection(row, sel) {
  return refElTable.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row) {
  refElTable.value?.setCurrentRow(row)
}

defineExpose({
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
})
</script>
