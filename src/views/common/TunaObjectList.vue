<template>
  <tuna-table-v2
    ref="refTable"
    :base-url="metaData.baseUrl"
    :context="metaData.context"
    :class-name="metaData.className"
    :query-params="metaData.queryParams"
    :excel-import-enable="metaData.excelEnable"
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
  </tuna-table-v2>
  <el-skeleton :rows="5" animated v-else/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from "vue-router";
import {doHttpGet} from "@/api/common/platform";
import {getRouteComponents} from "@/util/autoImportComponent.ts";

const {t, locale} = useI18n()
const refTable = ref(null)
const metaData = {}
const loading = ref(true)
const route = useRoute()
const {modules } = getRouteComponents()

function getComponent(path) {
  return modules['../views/microapp' + path]
}

onMounted(() => {
  const params = route.query
  metaData.className = params.className
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + metaData.className, {}).then(entityDefine => {
    metaData.context = entityDefine.serviceInstance.contextPath.substring(1)
    metaData.baseUrl = entityDefine.serviceInstance.contextPath + entityDefine.url
    try {
      metaData.queryParams = JSON.parse(decodeURIComponent(entityDefine.queryParams || "{}"))
    } catch (err) {
      console.log(err)
    }
    metaData.titleColumnName = entityDefine.titleColumnName
    metaData.operationColumnWidth = entityDefine.operationColumnWidth
    if(entityDefine.formComponent !== undefined) {
      metaData.formComponent = getComponent(entityDefine.formComponent)
    }
    metaData.formWidth = entityDefine.formWidth
    metaData.dialogModel = entityDefine.dialogModel === 'YES'
    metaData.paginationVisible = entityDefine.paginationVisible === 'YES' ? 1 : 0
    metaData.excelEnable = entityDefine.excelEnable === 'YES'
    metaData.queryFormVisible = entityDefine.queryFormVisible === 'YES' ? 1 : 0
    metaData.excelImportComponent = entityDefine.excelImportComponent
    metaData.rowKey = entityDefine.rowKey
    metaData.defaultExpandAll = entityDefine.defaultExpandAll === 'YES'
    metaData.treeProps = entityDefine.treeProps
    metaData.queryMode = entityDefine.queryMode === 'YES'
    metaData.multiple = entityDefine.multiple === 'YES'
    metaData.showLang = entityDefine.showLang
    metaData.showSummary = entityDefine.showSummary === 'YES'

    // 传递过来的queryParam拥有最高优先级
    if (params.titleColumnName !== undefined) metaData.titleColumnName = params.titleColumnName
    if (params.operationColumnWidth !== undefined) metaData.operationColumnWidth = params.operationColumnWidth
    if (params.formComponent !== undefined) metaData.formComponent = params.formComponent
    if (params.formWidth !== undefined) metaData.formWidth = params.formWidth
    if (params.dialogModel !== undefined) metaData.dialogModel = params.dialogModel === 'YES'
    if (params.paginationVisible !== undefined) metaData.paginationVisible = params.paginationVisible === 'YES' ? 1 : 0
    if (params.excelEnable !== undefined) metaData.excelEnable = params.excelEnable === 'YES'
    if (params.queryFormVisible !== undefined) metaData.queryFormVisible = params.queryFormVisible === 'YES'
    if (params.excelImportComponent !== undefined) metaData.excelImportComponent = params.excelImportComponent
    if (params.rowKey !== undefined) metaData.rowKey = params.rowKey
    if (params.defaultExpandAll !== undefined) metaData.defaultExpandAll = params.defaultExpandAll === 'YES'
    if (params.treeProps !== undefined) metaData.treeProps = params.treeProps
    if (params.queryMode !== undefined) metaData.queryMode = params.queryMode === 'YES'
    if (params.multiple !== undefined) metaData.multiple = params.multiple === 'YES'
    if (params.showLang !== undefined) metaData.showLang = params.showLang
    if (params.showSummary !== undefined) metaData.showSummary = params.showSummary === 'YES'

    // queryParams 特殊处理
    if (params.queryParams !== undefined) {
      try {
        metaData.queryParams = JSON.parse(decodeURIComponent(params.queryParams || ""))
      } catch (err) {
        console.log(err)
      }
    }
    console.log('模型元数据', metaData)
    loading.value = false
  })
})
</script>
