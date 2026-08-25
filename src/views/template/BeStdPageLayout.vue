<template>
  <be-table
    ref="refTable"
    :class-name="metaData.className"
    :api-query="metaData.apiQuery"
    :api-save="metaData.apiSave"
    :api-delete="metaData.apiDelete"
    :api-download-import-template="metaData.apiDownloadImportTemplate"
    :api-export="metaData.apiExport"
    :api-import-batch-save="metaData.apiImportBatchSave"
    :api-import-preview="metaData.apiImportPreview"
    :query-params="metaData.queryParams"
    :excel-import-component="metaData.excelImportComponent"
    :title-column-name="metaData.titleColumnName || 'name'"
    :operation-column-width="metaData.operationColumnWidth"
    :dialog-model="metaData.dialogModel"
    :form-width="metaData.formWidth"
    :form-component="getComponent(metaData.formComponent)"
    :pagination-visible="metaData.paginationVisible"
    :query-form-visible="metaData.queryFormVisible"
    :row-key="metaData.rowKey"
    :default-expand-all="metaData.defaultExpandAll"
    :tree-props="metaData.treeProps"
    :query-mode="metaData.queryMode"
    :multiple="metaData.multiple"
    :show-lang="metaData.showLang"
    :show-summary="metaData.showSummary"
    :data-render-finish="props.dataRenderFinish"
    :row-db-click="props.rowDbClick"
    v-if="loading === false"
  >
    <!-- 查询栏自定义组件 -->
    <template v-slot:query-form="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormComponent))" v-if="metaData.queryFormComponent"
                 :param="parseComponentParam(metaData.queryFormComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-extra="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormExtraComponent))" v-if="metaData.queryFormExtraComponent"
                 :param="parseComponentParam(metaData.queryFormExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-buttons="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormButtonsComponent))" v-if="metaData.queryFormButtonsComponent"
                 :param="parseComponentParam(metaData.queryFormButtonsComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:query-form-buttons-extra="scope">
      <component :is="getComponent(parseComponent(metaData.queryFormButtonExtraComponent))" v-if="metaData.queryFormButtonExtraComponent"
                 :param="parseComponentParam(metaData.queryFormButtonExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <!-- 工具栏自定义组件 -->
    <template v-slot:tool-buttons-extra="scope">
      <component :is="getComponent(parseComponent(metaData.toolButtonsExtraComponent))" v-if="metaData.toolButtonsExtraComponent"
                 :param="parseComponentParam(metaData.toolButtonsExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>
    <template v-slot:more-action-extra="scope">
      <component :is="getComponent(parseComponent(metaData.moreActionExtraComponent))" v-if="metaData.moreActionExtraComponent"
                 :param="parseComponentParam(metaData.moreActionExtraComponent)"
                 :refTable="refTable"
                 :queryParams="scope.queryParams"></component>
    </template>

    <!-- 操作列自定义组件（已享受预解析性能优化） -->
    <template v-slot:table-operation="scope">
      <component
        :is="operationComponents.main.component"
        v-if="operationComponents.main.component"
        :param="operationComponents.main.param"
        :refTable="refTable"
        :row="scope.row"
      ></component>
    </template>
    <template v-slot:table-operation-extra="scope">
      <component
        :is="operationComponents.extra.component"
        v-if="operationComponents.extra.component"
        :param="operationComponents.extra.param"
        :refTable="refTable"
        :row="scope.row"
      ></component>
    </template>
    <template v-slot:table-operation-end-extra="scope">
      <component
        :is="operationComponents.endExtra.component"
        v-if="operationComponents.endExtra.component"
        :param="operationComponents.endExtra.param"
        :refTable="refTable"
        :row="scope.row"
      ></component>
    </template>
  </be-table>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import { computed, defineExpose, defineModel, onMounted, ref, defineAsyncComponent, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRouteComponents } from "@/util/autoImportComponent.ts"
import { parseComponent, parseComponentParam } from "@/util/common.ts"
import { executeOpenApi } from "@/api/common/platform"
import { isFederationPath, loadFederationComponent } from "@/util/federationLoader.ts" // 引入模块联邦解析器

const props = defineProps<{
  className?: string
  layoutPramsId?: string
  meta?: object

  // 是否查询模式，开启后表格不能做编辑类操作
  queryMode?: boolean
  // 是否多选，仅由前端传递，适合对象的选择
  multiple?: boolean

  formComponent?: string
  // 页面数据加载完的回调函数
  dataRenderFinish?: (tableData) => void
  // 双击函数
  rowDbClick?: (row: any) => void
}>()

const { t, locale } = useI18n()
const refTable = ref(null)
const loading = ref(true)
const { modules } = getRouteComponents()
const metaData = ref({ ...props.meta })
const queryParams = defineModel<any>('queryParams', {
  default: () => ({
    current: 1,
    size: 20,
    descColumns: []
  })
})

/**
 * ⚡ 核心改造：双模式智能组件加载器
 * 1. 若为模块联邦路径（如 'micro_marketing/MarketingForm'）：走模块联邦动态拉取
 * 2. 若为本地相对路径（如 '/src/views/xxx.vue'）：走现有 modules 本地索引
 */
function getComponent(path: string | undefined): Component | null {
  if (!path) return null

  // 模式 A：判断是否命中模块联邦格式
  if (isFederationPath(path)) {
    const federationComp = loadFederationComponent(path)
    if (federationComp) {
      return federationComp
    }
  }

  // 模式 B：兼容现有的本地 Vite glob 路径
  const localComp = modules['..' + path]
  if (localComp) {
    // 若返回的是动态 import 函数则包裹 defineAsyncComponent，若已是组件对象直接返回
    return typeof localComp === 'function' && !localComp.name && !localComp.__vccOpts
      ? defineAsyncComponent(localComp as any)
      : localComp
  }

  console.warn(`[ComponentLoader] 未能找到组件，路径: ${path}`)
  return null
}

/**
 * 预计算并缓存操作列组件与参数，避免表格逐行渲染高频计算
 */
const operationComponents = computed(() => {
  return {
    main: {
      component: metaData.value.operationColumnComponent ? getComponent(parseComponent(metaData.value.operationColumnComponent)) : null,
      param: metaData.value.operationColumnComponent ? parseComponentParam(metaData.value.operationColumnComponent) : undefined
    },
    extra: {
      component: metaData.value.operationColumnExtraComponent ? getComponent(parseComponent(metaData.value.operationColumnExtraComponent)) : null,
      param: metaData.value.operationColumnExtraComponent ? parseComponentParam(metaData.value.operationColumnExtraComponent) : undefined
    },
    endExtra: {
      component: metaData.value.operationColumnExtraEndComponent ? getComponent(parseComponent(metaData.value.operationColumnExtraEndComponent)) : null,
      param: metaData.value.operationColumnExtraEndComponent ? parseComponentParam(metaData.value.operationColumnExtraEndComponent) : undefined
    }
  }
})

onMounted(() => {
  executeOpenApi('getLayoutParamsByIdOrClassName', {
    id: props.layoutPramsId,
    className: props.className,
    idQueryType: 'eq',
    classNameQueryType: 'eq'
  }, {}).then(rsp => {
    const layoutParams = rsp.data.records[0]
    Object.assign(metaData.value, layoutParams)
    metaData.value.queryParams = queryParams.value
    Object.assign(metaData.value.queryParams, JSON.parse(layoutParams?.queryParams || "{}"))
    loading.value = false

    if (props.formComponent) {
      metaData.value.formComponent = props.formComponent
    }
    if (props.queryMode) {
      metaData.value.queryMode = props.queryMode
    }
    if (props.multiple) {
      metaData.value.multiple = props.multiple
    }

    console.log('className: ' + metaData.value.className + ' metaData: ', metaData.value)
  })
})

const setCurrentRow = (row) => {
  refTable.value?.setCurrentRow(row)
}

const toggleRowSelection = (row, checked) => {
  refTable.value?.toggleRowSelection(row, checked)
}

const getSelectionRows = () => {
  return refTable.value?.getSelectionRows()
}

defineExpose({
  setCurrentRow,
  toggleRowSelection,
  getSelectionRows
})
</script>
