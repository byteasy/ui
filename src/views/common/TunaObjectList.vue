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
  <el-skeleton :rows="5" animated v-else />
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from "vue-router";
import {doHttpGet} from "@/api/common/platform";

const {t, locale} = useI18n()
const refTable = ref(null)
const metaData = ref({})
const loading = ref(true)
const route = useRoute()

onMounted(() => {
  const params = route.query
  metaData.value.className = params.className
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + metaData.value.className, {}).then(entityDefine => {
    metaData.value.context = entityDefine.serviceInstance.contextPath.substring(1)
    metaData.value.baseUrl = entityDefine.serviceInstance.contextPath + entityDefine.url
    try {
      metaData.value.queryParams = JSON.parse(decodeURIComponent(entityDefine.queryParams || ""))
    } catch (err) {
      console.log(err)
    }
    metaData.value.titleColumnName = entityDefine.titleColumnName
    metaData.value.operationColumnWidth = entityDefine.operationColumnWidth
    metaData.value.formComponent = entityDefine.formComponent
    metaData.value.formWidth = entityDefine.formWidth
    metaData.value.dialogModel = entityDefine.dialogModel === 'YES'
    metaData.value.paginationVisible = entityDefine.paginationVisible === 'YES' ? 1 : 0
    metaData.value.excelEnable = entityDefine.excelEnable === 'YES'
    metaData.value.queryFormVisible = entityDefine.queryFormVisible === 'YES' ? 1 : 0
    metaData.value.excelImportComponent = entityDefine.excelImportComponent
    metaData.value.rowKey = entityDefine.rowKey
    metaData.value.defaultExpandAll = entityDefine.defaultExpandAll === 'YES'
    metaData.value.treeProps = entityDefine.treeProps
    metaData.value.queryMode = entityDefine.queryMode === 'YES'
    metaData.value.multiple = entityDefine.multiple === 'YES'
    metaData.value.showLang = entityDefine.showLang
    metaData.value.showSummary = entityDefine.showSummary === 'YES'

    // 传递过来的queryParam拥有最高优先级
    if (params.titleColumnName !== undefined) metaData.value.titleColumnName = params.titleColumnName
    if (params.operationColumnWidth !== undefined) metaData.value.operationColumnWidth = params.operationColumnWidth
    if (params.formComponent !== undefined) metaData.value.formComponent = params.formComponent
    if (params.formWidth !== undefined) metaData.value.formWidth = params.formWidth
    if (params.dialogModel !== undefined) metaData.value.dialogModel = params.dialogModel === 'YES'
    if (params.paginationVisible !== undefined) metaData.value.paginationVisible = params.paginationVisible === 'YES' ? 1 : 0
    if (params.excelEnable !== undefined) metaData.value.excelEnable = params.excelEnable === 'YES'
    if (params.queryFormVisible !== undefined) metaData.value.queryFormVisible = params.queryFormVisible === 'YES'
    if (params.excelImportComponent !== undefined) metaData.value.excelImportComponent = params.excelImportComponent
    if (params.rowKey !== undefined) metaData.value.rowKey = params.rowKey
    if (params.defaultExpandAll !== undefined) metaData.value.defaultExpandAll = params.defaultExpandAll === 'YES'
    if (params.treeProps !== undefined) metaData.value.treeProps = params.treeProps
    if (params.queryMode !== undefined) metaData.value.queryMode = params.queryMode === 'YES'
    if (params.multiple !== undefined) metaData.value.multiple = params.multiple === 'YES'
    if (params.showLang !== undefined) metaData.value.showLang = params.showLang
    if (params.showSummary !== undefined) metaData.value.showSummary = params.showSummary === 'YES'

    // queryParams 特殊处理
    if (params.queryParams !== undefined) {
      try {
        metaData.value.queryParams = JSON.parse(decodeURIComponent(params.queryParams || ""))
      } catch (err) {
        console.log(err)
      }
    }
    console.log('模型元数据', metaData.value)
    loading.value = false
  })
})
</script>
