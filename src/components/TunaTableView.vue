<template>
  <el-table fix border scrollbar-always-on stripe highlight-current-row ref="refElTable">
    <el-table-column type="selection" width="55"
                     v-if="props.queryMode === true && props.multiple === true"/>
    <template v-for="col in tableColumns" :key="col.name">
      <slot :name="'table-column-def-' + col.name" :column="col">
        <el-table-column
          :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
          :fixed="col.isFixed === 'YES'"
          :label="getLangText(col.displayName, locale)"
          :prop="col.name"
          resizable
          v-if="col.isShow === 'YES' && col.type !== 'ENUM'"
          :min-width="col.width === 0 ? undefined : col.width"
          :show-overflow-tooltip="col.isOverflow === 'YES'"
          :sortable="col.isSort === 'YES'"
        >
          <template #default="scope">
            <slot :name="'table-cell-' + col.name" :row="scope.row">
              <el-link underline="never" type="primary" v-if="col.relationType === 'DETAIL_TABLE'">
                <tuna-i18n-value :model-value="scope.row[col.name]"
                                 :lang="props.showLang" @click="onOpenTableDetail(col, scope.row)"/>
              </el-link>
              <tuna-popup-object-view :model-value="scope.row[getClassFieldName(col.externalClass)]"
                                      :column="col" :lang="props.showLang"
                                      v-else-if="col.relationType === 'EXTERNAL_KEY'"/>
              <tuna-i18n-value v-else-if="col.isI18n === 'YES'" :model-value="scope.row[col.name]"
                               :lang="props.showLang"/>
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
        <enum-column
          :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
          :code="col.typeClassName"
          :context="props.context"
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
      v-if="props.operationColumnWidth !== 0 && props.queryMode !== true"
      align="center"
      :min-width="props.operationColumnWidth ? props.operationColumnWidth : 160"
    >
      <template #default="scope">
        <el-space direction="horizontal" :size="4">
          <slot name="table-operation" :row="scope.row">
            <tuna-popup-object-view :model-value="scope.row"
                                    :column="{ externalClass: props.className }"
                                    :lang="props.showLang">
              <template v-slot:reference>
                {{ t('table.view') }}
              </template>
            </tuna-popup-object-view>
            <el-link underline="never" @click="onEdit(scope.row)" type="primary"
                     v-permission="props.className + '.Edit'">
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
                <el-link underline="never" type="danger" v-permission="props.className + '.Delete'">
                  {{
                    t('table.delete')
                  }}
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
import {doHttpDelete, doHttpGet} from "@/api/common/platform";
import {ElMessage} from "element-plus";
import TunaTableForm from "@/components/TunaTableForm.vue";
import {type Component, defineExpose, ref} from "vue";
import {getClassFieldName} from "@/util/common.ts";
import TunaTableContainer from "@/components/TunaTableContainer.vue";
import {useModal} from "@/components/dialog/useModal.ts";

const refElTable = ref(null)
const {t, locale} = useI18n()
const {open} = useModal()

const props = defineProps<{
  baseUrl: string,
  tableColumns: Array<any>
  className: string
  excelImportEnable: boolean
  context: string
  refresh: () => void
  loadTableColumns: () => void
  showLang?: string
  formComponent?: Component
  excelImportComponent?: Component
  excelExportComponent?: Component
  formWidth?: string | number
  dialogModel?: any
  operationColumnWidth?: number
  queryParam?: any
  queryMode?: boolean
  multiple?: boolean
}>()

function onView(row) {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
    open(
      getFormComponent(), // 要显示的组件
      {
        columns: props.tableColumns,
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
      {columns: props.tableColumns, url: props.baseUrl, context: props.context, row: row}, // 传给组件的 props
      {
        title: t('add') + getLangText(entityDefine.name, locale.value),
        width: getFormWidth(),
        dialogModel: props.dialogModel,
        onClose: (data) => {
          if (data === 'ok') {
            props.refresh()
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
        columns: props.tableColumns,
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
            props.refresh()
          }
        },
      },
    )
  })
}

function onDelete(row) {
  doHttpDelete(props.baseUrl + '/' + row.id)
    .then((rsp) => {
      ElMessage.success(t('operationSuccess'))
      props.refresh()
    })
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

function getSelectionRows() {
  return refElTable.value?.getSelectionRows()
}

function toggleRowSelection(row, sel) {
  return refElTable.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row) {
  refElTable.value?.setCurrentRow(row)
}

defineExpose({
  onView,
  onAdd,
  onEdit,
  onDelete,
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
})
</script>
