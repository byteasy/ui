<template>
  <tuna-table-v2
    ref="refTable"
    :base-url="metaData.baseUrl"
    :context="metaData.context"
    :class-name="metaData.className"
    :query-params="metaData.queryParams"
    :excel-import-enable="metaData.excelEnable"
    :excel-import-component="metaData.excelImportComponent"
    :title-column-name="metaData.titleColumnName || 'name'"
    :operation-column-width="metaData.operationColumnWidth"
    :dialog-model="metaData.dialogModel"
    :form-width="metaData.formWidth"
    :form-component="metaData.formComponent"
    :pagination-visible="metaData.paginationVisible"
    :query-form-visible="metaData.queryFormVisible"
    :row-key="metaData.rowKey"
    :default-expand-all="metaData.defaultExpandAll"
    :tree-props="metaData.treeProps"
    :query-mode="metaData.queryMode"
    :multiple="metaData.multiple"
    :show-lang="metaData.showLang"
    :show-summary="metaData.showSummary"
    v-if="loading === false"
  >
    <template v-for="col in fieldComponents" :key="col.name"
              v-slot:[`form-query-field-${col.name}`]="scope">
      <component :is="getComponent('..' + col.fieldComponent)" v-model="scope.queryParam[col.name]"
                 :style="{ width: (col.width === 0 ? 160 : col.width) + 'px !important' }"
                 :key="col.className + col.name" clearable @change="refTable.refresh()"></component>
    </template>
    <template v-slot:form-query-buttons-extra="scope">
      <component v-for="btn in formQueryButtonsExtra" :key="btn" :is="getComponent('..' + btn)"
                 :queryParam="scope.queryParam" :queryMode="scope.queryMode"></component>
    </template>
    <template v-slot:table-operation-extra="scope">
      <component v-for="btn in operationButtons" :key="btn" :is="getComponent('..' + btn)"
                 :row="scope.row"></component>
    </template>
  </tuna-table-v2>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from "vue-router";
import {doHttpGet, getEntitySchema} from "@/api/common/platform";
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import TunaDefaultObjectForm from "@/views/common/TunaDefaultObjectForm.vue";
import {queryStringToJson} from "@/util/common.ts";

const props = defineProps<{
  metaData?: object | null | undefined
}>()

const {t, locale} = useI18n()
const refTable = ref(null)
const metaData = {}
const loading = ref(true)
const route = useRoute()
const {modules} = getRouteComponents()
const fieldComponents = ref([])
const formQueryButtonsExtra = ref([])
const operationButtons = ref([])

function getComponent(path) {
  return modules[path]
}

onMounted(() => {
  const params = { ...route.query } // 浅拷贝，避免直接修改路由对象
  if (props.metaData && typeof props.metaData === 'object' && !Array.isArray(props.metaData)) {
    Object.assign(params, props.metaData)
  }
  console.log('params', params)
  metaData.className = params.className
  metaData.formComponent = TunaDefaultObjectForm
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + metaData.className, {}).then(entityDefine => {
    metaData.context = entityDefine.serviceInstance.contextPath.substring(1)
    metaData.baseUrl = entityDefine.serviceInstance.contextPath + entityDefine.url
    metaData.queryParams = queryStringToJson(entityDefine.queryParams)
    metaData.titleColumnName = entityDefine.titleColumnName
    metaData.operationColumnWidth = entityDefine.operationColumnWidth
    if (entityDefine.formComponent) {
      metaData.formComponent = getComponent('..' + entityDefine.formComponent)
    }
    metaData.formWidth = entityDefine.formWidth
    metaData.dialogModel = entityDefine.dialogModel === 'YES'
    metaData.paginationVisible = entityDefine.paginationVisible === 'YES' ? 1 : 0
    metaData.excelEnable = entityDefine.excelEnable === 'YES'
    metaData.queryFormVisible = entityDefine.queryFormVisible === 'YES' ? 1 : 0
    if (entityDefine.excelImportComponent) {
      metaData.excelImportComponent = getComponent('..' + entityDefine.excelImportComponent)
    }
    metaData.rowKey = entityDefine.rowKey
    metaData.defaultExpandAll = entityDefine.defaultExpandAll === 'YES'
    metaData.treeProps = entityDefine.treeProps
    metaData.queryMode = entityDefine.queryMode === 'YES'
    metaData.multiple = entityDefine.multiple === 'YES'
    metaData.showLang = entityDefine.showLang
    metaData.showSummary = entityDefine.showSummary === 'YES'
    if (entityDefine.queryBarButtons) {
      formQueryButtonsExtra.value = entityDefine.queryBarButtons.split(',')
    }
    if (entityDefine.operationButtons) {
      operationButtons.value = entityDefine.operationButtons.split(',')
    }

    // 传递过来的queryParam拥有最高优先级
    if (params.titleColumnName !== undefined) metaData.titleColumnName = params.titleColumnName
    if (params.operationColumnWidth !== undefined) metaData.operationColumnWidth = params.operationColumnWidth
    if (params.formComponent) metaData.formComponent = getComponent('..' + params.formComponent)
    if (params.formWidth !== undefined) metaData.formWidth = params.formWidth
    if (params.dialogModel !== undefined) metaData.dialogModel = params.dialogModel === 'YES'
    if (params.paginationVisible !== undefined) metaData.paginationVisible = params.paginationVisible === 'YES' ? 1 : 0
    if (params.excelEnable !== undefined) metaData.excelEnable = params.excelEnable === 'YES'
    if (params.queryFormVisible !== undefined) metaData.queryFormVisible = params.queryFormVisible === 'YES'
    if (params.excelImportComponent) metaData.excelImportComponent = getComponent('..' + params.excelImportComponent)
    if (params.rowKey !== undefined) metaData.rowKey = params.rowKey
    if (params.defaultExpandAll !== undefined) metaData.defaultExpandAll = params.defaultExpandAll === 'YES'
    if (params.treeProps !== undefined) metaData.treeProps = params.treeProps
    if (params.queryMode !== undefined) metaData.queryMode = params.queryMode === 'YES'
    if (params.multiple !== undefined) metaData.multiple = params.multiple === 'YES'
    if (params.showLang !== undefined) metaData.showLang = params.showLang
    if (params.showSummary !== undefined) metaData.showSummary = params.showSummary === 'YES'

    // queryParams 特殊处理
    if (params.queryParams !== undefined) {
      metaData.queryParams = queryStringToJson(params.queryParams)
    }

    console.log('模型元数据', metaData)
    getEntitySchema(metaData.context, metaData.className)
      .then((response) => {
        fieldComponents.value = response.data.filter(s => s.fieldComponent)
        loading.value = false
      })
  })
})
</script>
