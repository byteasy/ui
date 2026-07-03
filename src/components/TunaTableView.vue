<template>
  <el-table fix border scrollbar-always-on stripe highlight-current-row>
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
              <tuna-i18n-value v-if="col.isI18n === 'YES'" :model-value="scope.row[col.name]"
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
                  <el-dropdown-item @click="emit('switchView')">
                    <el-icon>
                      <List/>
                    </el-icon>
                    {{ $t('table.viewModel') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="onColumnDefineClick">
                    <el-icon>
                      <SetUp/>
                    </el-icon>
                    {{ $t('table.customColumn') }}
                  </el-dropdown-item>
<!--                  <el-dropdown-item>-->
<!--                    <el-icon>-->
<!--                      <DCaret/>-->
<!--                    </el-icon>-->
<!--                    {{ $t('table.customSort') }}-->
<!--                  </el-dropdown-item>-->
                  <el-dropdown-item divided @click="downLoadExcelTemplate"
                                    v-if="props.excelImportEnable === true && sessionStore.authorize(props.className + '.Import')">
                    <el-icon>
                      <Download/>
                    </el-icon>
                    {{ $t('table.downLoadExcelTemplate') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="onExcelImportClick"
                                    v-if="props.excelImportEnable === true && sessionStore.authorize(props.className + '.Import')">
                    <el-icon>
                      <IconLocalExcel/>
                    </el-icon>
                    {{ $t('table.importByExcel') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="onExcelExportClick"
                    v-if="props.excelImportEnable === true && sessionStore.authorize(props.className + '.Export')">
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
        <el-space direction="horizontal" :size="4">
          <slot name="table-operation" :row="scope.row">
            <el-link underline="never" @click="onView(scope.row)" type="primary">
              {{ t('table.view') }}
            </el-link>
            <el-link underline="never" @click="onEdit(scope.row)" type="primary" v-permission="props.className + '.Edit'">
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
                <el-link underline="never" type="danger" v-permission="props.className + '.Delete'">{{
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
import {useAppSettingsStore} from "@/stores/appSettings.ts";
import {doHttpDelete} from "@/api/common/platform";
import {ElMessage} from "element-plus";
import TunaTableForm from "@/components/TunaTableForm.vue";
import {type Component, defineEmits, defineExpose, ref} from "vue";
import TunaColumnDefine from "@/components/TunaColumnDefine.vue";
import {putValueIfValid} from "@/util/common.ts";
import {useRoute} from "vue-router";
import {useSessionStore} from "@/stores/session.ts";
import TunaExcelImport from "@/components/TunaExcelImport.vue";
import TunaExcelExport from "@/components/TunaExcelExport.vue";
import {useModal} from "@/components/dialog/useModal.ts";

const appSettingsStore = useAppSettingsStore()
const {t, locale} = useI18n()
const route = useRoute()
const sessionStore = useSessionStore()
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
}>()

const emit = defineEmits(['switchView'])

function downLoadExcelTemplate() {
  window.open(props.baseUrl + '/excel/template?lang=' + appSettingsStore.lang, '_blank')
}

function onView(row) {
  const [lastRoute] = route.matched.slice(-1)
  const title = getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value)
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
      title: t('table.view') + title,
      width: getFormWidth(),
      dialogModel: props.dialogModel,
      onClose: (data) => {
      },
    },
  )
}


function onAdd(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getFormComponent(), // 要显示的组件
    {columns: props.tableColumns, url: props.baseUrl, context: props.context, row: row}, // 传给组件的 props
    {
      title: t('add') + getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value),
      width: getFormWidth(),
      dialogModel: props.dialogModel,
      onClose: (data) => {
        props.refresh()
      },
    },
  )
}

function onEdit(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    getFormComponent(), // 要显示的组件
    {
      columns: props.tableColumns,
      row: row,
      url: props.baseUrl,
      context: props.context,
    }, // 传给组件的 props
    {
      title: t('table.edit') + getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value),
      width: getFormWidth(),
      dialogModel: props.dialogModel,
      onClose: (data) => {
        props.refresh()
      },
    },
  )
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

function onColumnDefineClick() {
  open(
    TunaColumnDefine,
    {
      columns: mergeLocalStorage(props.tableColumns),
      className: props.className,
    }, // 传给组件的 props
    {
      title: t('table.customColumn'),
      width: getFormWidth() || "50%",
      onClose: (data) => {
        // TODO
        // loadTableColumns()
      },
    },
  )
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

function onExcelImportClick() {
  const [lastRoute] = route.matched.slice(-1)
  const title = getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value)
  open(
    props.excelImportComponent || TunaExcelImport,
    {
      columns: props.tableColumns,
      url: props.baseUrl,
      context: props.context
    }, // 传给组件的 props
    {
      title: t('table.importByExcel') + '>' + title,
      width: getFormWidth(),
      onClose: (data) => {
        props.refresh()
      }
    }
  )
}

function onExcelExportClick() {
  const [lastRoute] = route.matched.slice(-1)
  const title = getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value)
  open(
    props.excelExportComponent || TunaExcelExport,
    {
      columns: props.tableColumns,
      url: props.baseUrl,
      queryParam: props.queryParam,
    }, // 传给组件的 props
    {
      title: t('table.exportToExcel') + '>' + title,
      width: getFormWidth(),
      onClose: (data) => {
        props.refresh()
      }
    }
  )
}

defineExpose({
  onView,
  onAdd,
  onEdit,
  onDelete
})
</script>
