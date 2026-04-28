<template>
  <!-- 替换 el-space，使用 CSS 网格布局（最稳、最整齐） -->
  <div class="card-grid p-2 pt-4">
    <div
      class="card-item"
      v-for="entity in props.data"
      :key="entity.id"
    >
      <el-descriptions border :column="2" class="el-card w-full h-full">
        <template #extra>
          <div class="mt-3">
            <el-space direction="horizontal" :size="4" class="mt-1 mr-2">
              <slot name="table-operation" :row="entity">
                <el-link underline="never" @click="onView(entity)" type="primary">
                  {{ t('table.view') }}
                </el-link>
                <el-link underline="never" @click="onEdit(entity)" type="primary"
                         v-permission="props.className + '.Edit'">
                  {{ t('table.edit') }}
                </el-link>
                <slot name="table-operation-extra" :row="entity"></slot>
                <el-popconfirm
                  :confirm-button-text="$t('ok')"
                  :cancel-button-text="$t('cancel')"
                  :title="$t('deleteWarn')"
                  :hide-after="10"
                  @confirm="onDelete(entity)"
                >
                  <template #reference>
                    <el-link underline="never" type="danger"
                             v-permission="props.className + '.Delete'">{{
                        t('table.delete')
                      }}
                    </el-link>
                  </template>
                </el-popconfirm>
                <slot name="table-operation-end-extra" :row="entity"></slot>
              </slot>
            </el-space>
          </div>
        </template>
        <template #title>
          <div class="mt-3">
            <el-link type="primary" @click="onView(entity)" class="ml-3">
              <el-text size="large" class="">
                <tuna-i18n-value :model-value="entity[props.titleColumnName || 'name' ]"></tuna-i18n-value>
              </el-text>
            </el-link>
          </div>
        </template>
        <template v-for="col in props.tableColumns" :key="col.name">
          <el-descriptions-item
            :label="getLangText(col.displayName, locale)"
            v-if="col.isShow === 'YES' && col.name !== props.titleColumnName"
          >
            <slot :name="'table-cell-' + col.name" :row="entity">
              <tuna-i18n-value v-if="col.isI18n === 'YES'" :model-value="entity[col.name]"
                               :lang="props.showLang"/>
              <enum-viewer
                v-else-if="col.type === 'ENUM'"
                :prop="entity[col.name]"
                :context="props.context"
                :code="col.typeClassName"
              />
              <span v-else>{{ entity[col.name] }}</span>
            </slot>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts">
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {useAppSettingsStore} from "@/stores/appSettings.ts";
import {doHttpDelete} from "@/api/common/platform";
import {ElMessage} from "element-plus";
import TunaTableForm from "@/components/TunaTableForm.vue";
import {type Component, computed, defineEmits, defineExpose} from "vue";
import TunaColumnDefine from "@/components/TunaColumnDefine.vue";
import {putValueIfValid} from "@/util/common.ts";
import {useRoute} from "vue-router";
import {useSessionStore} from "@/stores/session.ts";
import TunaExcelImport from "@/components/TunaExcelImport.vue";
import {useModal} from "@/components/dialog/useModal.ts";

const appSettingsStore = useAppSettingsStore()
const {t, locale} = useI18n()
const route = useRoute()
const sessionStore = useSessionStore()
const {open} = useModal()

const props = defineProps<{
  width: number
  baseUrl: string,
  tableColumns: Array<any>
  className: string
  excelImportEnable: boolean
  context: string
  refresh: () => void
  loadTableColumns: () => void
  data: Array<any>
  showLang?: string
  formComponent?: Component
  excelImportComponent?: Component
  formWidth?: string | number
  dialogModel?: boolean
  operationColumnWidth?: number
  titleColumnName?: string
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
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('operationFailed'))
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
  return props.formWidth !== undefined ? props.formWidth : '50%'
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
      width: getFormWidth(),
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
    getExcelImportComponent(),
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

function getExcelImportComponent() {
  if (props.excelImportComponent) {
    return props.excelImportComponent
  } else {
    return TunaExcelImport
  }
}

defineExpose({
  onView,
  onAdd,
  onEdit,
  onDelete
})
</script>
<style scoped>
/* 基础网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 默认超大屏：一行 4 个 */
  gap: 16px;
}

/* 屏幕 < 2000px → 一行 3 个 */
@media (max-width: 2600px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 屏幕 < 2000px → 一行 3 个 */
@media (max-width: 2000px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 屏幕 < 1500px → 一行 2 个 */
@media (max-width: 1500px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 屏幕 < 768px → 一行 1 个 */
@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* 卡片强制占满格子 */
.card-item {
  width: 100%;
}

/* el-descriptions 永远 100% 宽度、内容不溢出 */
:deep(.el-descriptions) {
  width: 100% !important;
  table-layout: fixed;
  box-sizing: border-box;
}
</style>
