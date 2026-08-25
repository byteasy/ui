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
    <!-- 工具栏自定义组件，分为工具栏按钮拓展组件和更多下拉菜单拓展组件 -->
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

    <!-- 🔥 操作列的自定义组件：直接读取预解析缓存，避免每行重复计算 -->
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
import {computed, defineAsyncComponent, defineExpose, defineModel, h, onMounted, ref, type Component} from 'vue'
import {useI18n} from 'vue-i18n'
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
import {executeOpenApi} from "@/api/common/platform";

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
  dataRenderFinish?: (tableData: any) => void
  // 双击函数
  rowDbClick?: (row: any) => void
}>()

const {t, locale} = useI18n()
const refTable = ref(null)
const loading = ref(true)
const {modules} = getRouteComponents()
const metaData = ref({...props.meta})
const queryParams = defineModel<any>('queryParams', {
  default: () => ({
    current: 1,
    size: 20,
    descColumns: []
  })
})

// 缓存动态 ESM 异步组件实例，避免同一 URL 多次重复网络请求
const dynamicComponentCache = new Map<string, Component>()

/**
 * 将 import 语句中的解构内容转换为合法 JS 解构语句
 * 例如将 "openBlock as _openBlock, ref" 转换为 "openBlock: _openBlock, ref"
 */
function parseImportClause(clause: string): string {
  return clause
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      // 匹配 "a as b" 并替换为 "a: b"
      if (/\s+as\s+/.test(item)) {
        const [orig, alias] = item.split(/\s+as\s+/)
        return `${orig.trim()}: ${alias.trim()}`
      }
      return item
    })
    .join(', ')
}

/**
 * 核心：支持 ESM 裸模块重写的安全动态加载器
 */
async function fetchAndExecuteEsm(url: string) {
  // 1. 请求远程组件脚本源码
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status} fetching ${url}`)
  }
  let code = await response.text()

  // 2. 注入宿主共享实例头
  const bridgeHeader = `
const _Vue = window.__SHARED_VUE__ || {};
const _ElementPlus = window.__SHARED_ELEMENT_PLUS__ || {};
const _ElementIcons = window.__SHARED_ELEMENT_ICONS__ || {};
`

  // 3. 精准转换各个模块的 import 语句
  const transformImport = (sourceCode: string, moduleName: string, globalVar: string) => {
    // 匹配: import { ... } from "moduleName";
    const namedImportRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(namedImportRegex, (_, clause) => {
      return `const { ${parseImportClause(clause)} } = ${globalVar};`
    })

    // 匹配: import * as Foo from "moduleName";
    const starImportRegex = new RegExp(`import\\s*\\*\\s*as\\s+([\\w$]+)\\s*from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(starImportRegex, (_, alias) => {
      return `const ${alias} = ${globalVar};`
    })

    // 匹配: import Foo from "moduleName";
    const defaultImportRegex = new RegExp(`import\\s+([\\w$]+)\\s+from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(defaultImportRegex, (_, alias) => {
      return `const ${alias} = ${globalVar}.default || ${globalVar};`
    })

    return sourceCode
  }

  code = transformImport(code, 'vue', '_Vue')
  code = transformImport(code, 'element-plus', '_ElementPlus')
  code = transformImport(code, '@element-plus/icons-vue', '_ElementIcons')

  // 4. 转成 Blob URL 并通过浏览器原生 dynamic import 执行
  const blob = new Blob([bridgeHeader + '\n' + code], { type: 'application/javascript' })
  const blobUrl = URL.createObjectURL(blob)

  try {
    const dynamicImport = new Function('u', 'return import(u)')
    const module = await dynamicImport(blobUrl)
    return module
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

/**
 * 通用组件加载入口
 */
function getComponent(path: string | null | undefined) {
  if (!path) return null

  // 1. 判断是否为远程动态脚本
  const isRemote = /^(https?:)?\/\//.test(path) || /\.(js|mjs)(\?.*)?$/.test(path)

  if (isRemote) {
    if (dynamicComponentCache.has(path)) {
      return dynamicComponentCache.get(path)!
    }

    const asyncComp = defineAsyncComponent({
      loader: async () => {
        try {
          const [scriptUrl, componentName] = path.split('#')
          const module = await fetchAndExecuteEsm(scriptUrl)
          const comp = componentName ? module[componentName] : (module.default || module)

          if (!comp) {
            throw new Error(`在模块中未找到组件 "${componentName || 'default'}"`)
          }
          return comp
        } catch (err) {
          console.error(`[Dynamic Loader] 远程组件加载失败: ${path}`, err)
          throw err
        }
      },
      loadingComponent: {
        render() {
          return h('span', { class: 'text-xs text-gray-400 py-1' }, '组件加载中...')
        }
      },
      errorComponent: {
        render() {
          return h('span', { class: 'text-xs text-red-500', title: `加载失败: ${path}` }, '[远程组件异常]')
        }
      },
      delay: 80,
      timeout: 8000
    })

    dynamicComponentCache.set(path, asyncComp)
    return asyncComp
  }

  // 2. 本地相对路径组件查找
  return modules['..' + path] || modules[path] || null
}

/**
 * ⚡ 优化：预先计算并缓存操作列的组件实例和参数
 * 避免在表格每行渲染时重复调用 parseComponent 和 getComponent
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

const setCurrentRow = (row: any) => {
  refTable.value?.setCurrentRow(row)
}

const toggleRowSelection = (row: any, checked: boolean) => {
  refTable.value?.toggleRowSelection(row, checked)
}

const getSelectionRows = () => {
  return refTable.value?.getSelectionRows()
}

defineExpose({
  setCurrentRow, toggleRowSelection, getSelectionRows
})
</script>
