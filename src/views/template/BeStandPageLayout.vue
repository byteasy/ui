<template>
  <be-table
    ref="refTable"
    :class-name="localMetaData.className"
    :api-query="localMetaData.apiQuery"
    :query-params="localMetaData.queryParams"
    :excel-import-enable="localMetaData.excelEnable"
    :excel-import-component="localMetaData.excelImportComponent"
    :title-column-name="localMetaData.titleColumnName || 'name'"
    :operation-column-width="localMetaData.operationColumnWidth"
    :dialog-model="localMetaData.dialogModel"
    :form-width="localMetaData.formWidth"
    :form-component="getComponent(localMetaData.formComponent)"
    :pagination-visible="localMetaData.paginationVisible"
    :query-form-visible="localMetaData.queryFormVisible"
    :row-key="localMetaData.rowKey"
    :default-expand-all="localMetaData.defaultExpandAll"
    :tree-props="localMetaData.treeProps"
    :query-mode="localMetaData.queryMode"
    :show-lang="localMetaData.showLang"
    :show-summary="localMetaData.showSummary"
    v-if="loading === false"
  >
    <template v-for="col in fieldComponents" :key="col.name"
              v-slot:[`form-query-field-${col.name}`]="scope">
      <component :is="getComponent(parseComponent(col.fieldComponent))"
                 v-model="scope.queryParam[col.name]"
                 :param="parseComponentParam(col.fieldComponent)"
                 :style="{ width: (col.width === 0 ? 160 : col.width) + 'px !important' }"
                 :key="col.className + col.name" clearable @change="refTable.refresh()"></component>
    </template>
    <template v-slot:form-query-buttons-extra="scope">
      <component v-for="btn in formQueryButtonsExtra"
                 :key="btn + '_' + (scope.row.id || scope.$index)"
                 :is="getComponent( parseComponent(btn))"
                 :param="parseComponentParam(btn)"
                 :queryParam="scope.queryParam" :queryMode="scope.queryMode"></component>
    </template>
    <template v-slot:table-operation-extra="scope">
      <component v-for="btn in operationButtons" :key="btn + '_' + (scope.row.id || scope.$index)"
                 :is="getComponent(parseComponent(btn))"
                 :param="parseComponentParam(btn)"
                 :tableRef="refTable"
                 :row="scope.row"></component>
    </template>
  </be-table>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import {defineModel, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from "vue-router";
import {doHttpGet, getEntitySchema} from "@/api/common/platform";
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam, queryStringToJson} from "@/util/common.ts";

const props = defineProps<{
  metaData?: object | null | undefined
}>()

const {t, locale} = useI18n()
const refTable = ref(null)
const loading = ref(true)
const route = useRoute()
const {modules} = getRouteComponents()
const fieldComponents = ref([])
const formQueryButtonsExtra = ref([])
const operationButtons = ref([])
const localMetaData = defineModel<any>('metaData', {default: () => ({})})

function getComponent(path) {
  return modules['..' + path]
}

onMounted(() => {
  const params = {...route.query} // 浅拷贝，避免直接修改路由对象
  console.log('params', params)
  if (params.className) {
    localMetaData.value.className = params.className
  }
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + localMetaData.value.className, {}).then(entityDefine => {
    const tmpParams = queryStringToJson(entityDefine.queryParams)
    Object.assign(localMetaData.value.queryParams, tmpParams)
    localMetaData.value.apiQuery = entityDefine.serviceInstance.contextPath + '/sapi/common/' + localMetaData.value.className
    localMetaData.value.titleColumnName = entityDefine.titleColumnName
    localMetaData.value.operationColumnWidth = entityDefine.operationColumnWidth
    if (entityDefine.formComponent) {
      localMetaData.value.formComponent = entityDefine.formComponent
    }
    localMetaData.value.formWidth = entityDefine.formWidth
    localMetaData.value.dialogModel = parseYesNoToBoolean(entityDefine.dialogModel)
    localMetaData.value.paginationVisible = entityDefine.paginationVisible !== undefined ? (entityDefine.paginationVisible === 'YES' ? 1 : 0) : undefined
    localMetaData.value.excelEnable = parseYesNoToBoolean(entityDefine.excelEnable)
    localMetaData.value.queryFormVisible = entityDefine.queryFormVisible !== undefined ? (entityDefine.queryFormVisible === 'YES' ? 1 : 0) : undefined
    if (entityDefine.excelImportComponent) {
      localMetaData.value.excelImportComponent = getComponent(entityDefine.excelImportComponent)
    }
    localMetaData.value.rowKey = entityDefine.rowKey
    localMetaData.value.defaultExpandAll = parseYesNoToBoolean(entityDefine.defaultExpandAll)
    localMetaData.value.treeProps = entityDefine.treeProps
    localMetaData.value.queryMode = parseYesNoToBoolean(entityDefine.queryMode)
    localMetaData.value.showLang = entityDefine.showLang
    localMetaData.value.showSummary = parseYesNoToBoolean(entityDefine.showSummary)
    if (entityDefine.queryBarButtons) {
      formQueryButtonsExtra.value = entityDefine.queryBarButtons.split(',')
    }
    if (entityDefine.operationButtons) {
      operationButtons.value = entityDefine.operationButtons.split(',')
    }

    // 传递过来的queryParam拥有最高优先级
    if (params.apiQuery !== undefined) localMetaData.value.apiQuery = params.apiQuery
    if (params.titleColumnName !== undefined) localMetaData.value.titleColumnName = params.titleColumnName
    if (params.operationColumnWidth !== undefined) localMetaData.value.operationColumnWidth = params.operationColumnWidth
    if (params.formComponent) localMetaData.value.formComponent = params.formComponent
    if (params.formWidth !== undefined) localMetaData.value.formWidth = params.formWidth
    if (params.dialogModel !== undefined) localMetaData.value.dialogModel = params.dialogModel === 'YES'
    if (params.paginationVisible !== undefined) localMetaData.value.paginationVisible = params.paginationVisible === 'YES' ? 1 : 0
    if (params.excelEnable !== undefined) localMetaData.value.excelEnable = params.excelEnable === 'YES'
    if (params.queryFormVisible !== undefined) localMetaData.value.queryFormVisible = params.queryFormVisible === 'YES'
    if (params.excelImportComponent) localMetaData.value.excelImportComponent = getComponent(params.excelImportComponent)
    if (params.rowKey !== undefined) localMetaData.value.rowKey = params.rowKey
    if (params.defaultExpandAll !== undefined) localMetaData.value.defaultExpandAll = params.defaultExpandAll === 'YES'
    if (params.treeProps !== undefined) localMetaData.value.treeProps = params.treeProps
    if (params.queryMode !== undefined) localMetaData.value.queryMode = params.queryMode === 'YES'
    if (params.showLang !== undefined) localMetaData.value.showLang = params.showLang
    if (params.showSummary !== undefined) localMetaData.value.showSummary = params.showSummary === 'YES'

    // queryParams 特殊处理
    if (params.queryParams !== undefined && typeof params.queryParams === 'string') {
      Object.assign(localMetaData.value.queryParams, JSON.parse(params.queryParams) || {})
    } else {
      Object.assign(localMetaData.value.queryParams, params.queryParams || {})
    }

    console.log('模型元数据', localMetaData.value)
    getEntitySchema(localMetaData.value.className)
      .then((response) => {
        fieldComponents.value = response.data.filter(s => s.fieldComponent)
        loading.value = false
      })
  })
})

function parseYesNoToBoolean(value) {
  if (value === undefined) {
    return undefined
  }
  return value === 'YES'
}
</script>
