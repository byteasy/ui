<template>
  <!-- 外层容器：相对定位，用于右上角定位 -->
  <div class="card-grid-wrapper p-2 pt-3 relative">
    <!-- 右上角：更多 文字 -->
    <div class="card-grid-more">
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
            <!--            <el-dropdown-item>-->
            <!--              <el-icon>-->
            <!--                <DCaret/>-->
            <!--              </el-icon>-->
            <!--              {{ $t('table.customSort') }}-->
            <!--            </el-dropdown-item>-->
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

    <!-- 卡片网格 -->
    <div class="card-grid" v-if="props.data?.length && props.data.length > 0">
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
              <slot name="table-column-title" :row="entity">
                <el-link type="primary" @click="onView(entity)" class="ml-3">
                  <el-text size="large" class="my-font-bold">
                    <tuna-i18n-value
                      :model-value="entity[props.titleColumnName || 'name' ]"></tuna-i18n-value>
                  </el-text>
                </el-link>
              </slot>
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
                <el-switch v-model="entity[col.name]" v-else-if="col.type === 'BOOL'" disabled>
                  <template #active-action>
                    <span>T</span>
                  </template>
                  <template #inactive-action>
                    <span>F</span>
                  </template>
                </el-switch>
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
    <div class="w-full flex-row justify-content-right" v-else>
      <el-empty class="w-full"/>
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
import TunaExcelExport from "@/components/TunaExcelExport.vue";
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
  data: Array<any> | undefined
  showLang?: string
  formComponent?: Component
  excelImportComponent?: Component
  excelExportComponent?: Component
  formWidth?: string | number
  dialogModel?: any
  operationColumnWidth?: number
  titleColumnName?: string
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
    },
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

<style scoped>
/* 外层容器：用于定位右上角 */
.card-grid-wrapper {
  position: relative;
}

/* 右上角更多文字：不明显、低调、可点击 */
.card-grid-more {
  position: absolute;
  top: 1px;
  right: 7px;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-top: 12px; /* 给右上角文字留出空间 */
}

/* 响应式 */
@media (max-width: 2600px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 2000px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1500px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.card-item {
  width: 100%;
}

:deep(.el-descriptions) {
  width: 100% !important;
  table-layout: fixed;
  box-sizing: border-box;
}
</style>
