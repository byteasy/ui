<template>
  <tuna-table-v2
    ref="refTable"
    :base-url="metaData.baseUrl"
    :context="metaData.context"
    :class-name="metaData.className"
    :query-params="metaData.queryParams"
    :excel-import-enable="metaData.excelEnable || true"
    :title-column-name="metaData.titleColumnName || 'name'"
    :operation-column-width="metaData.operationColumnWidth"
    :dialog-model="metaData.dialogModel"
    :pagination-visible="metaData.paginationVisible"
    v-if="loading === false"
  >
  </tuna-table-v2>
  <el-skeleton :rows="5" animated v-else />
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from "vue-router";

const {t, locale} = useI18n()
const refTable = ref(null)
const metaData = ref({})
const loading = ref(true)
const route = useRoute()

onMounted(() => {
  const params = route.query
  metaData.value.baseUrl = params.baseUrl
  metaData.value.context = params.context
  metaData.value.className = params.className
  try {
    metaData.value.queryParams = JSON.parse(decodeURIComponent(params.queryParams || ""))
  } catch (err) {
    console.log(err)
  }
  metaData.value.excelEnable = params.excelEnable === 'true'
  metaData.value.titleColumnName = params.titleColumnName
  metaData.value.operationColumnWidth = params.operationColumnWidth
  metaData.value.dialogModel = params.dialogModel
  metaData.value.paginationVisible = params.paginationVisible
  console.log(metaData.value)
  loading.value = false
})
</script>
