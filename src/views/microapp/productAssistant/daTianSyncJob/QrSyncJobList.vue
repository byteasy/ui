<template>
  <tuna-table
    ref="refTable"
    base-url="/product-assistant/sapi/qrSyncJobs"
    context="product-assistant"
    class-name="com.tuna.productAssistant.entity.QrSyncJob"
    :query-params="{ descColumns: ['createdTime'] }"
    :row-db-click="() => {}"
  >
    <template v-slot:formQueryButton>
      <el-button type="primary" icon="Search" @click="refTable?.refresh">{{
          $t('search')
        }}</el-button>
    </template>
    <template v-slot:table_column_excels="excelsScode">
      <el-button type="primary" text @click="downLoad(excelsScode.row)">打包下载</el-button>
    </template>
    <template v-slot:operationSlot="operationSlot">
      <el-button link type="primary" @click="grabQrCode(operationSlot.row)" :disabled="operationSlot.row.pullStatus === 'YES'" :loading="loading">抓取二维码</el-button>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { doHttpGet } from '@/api/common/platform'
import { ElMessage } from 'element-plus'

const { t } = useI18n() // 表单引用
const loading = ref(false)

const refTable = ref(null)

function downLoad(row) {
  window.open('/product-assistant/sapi/qrSyncJobs/excels/download?id=' + row.id, '_blank')
}

function grabQrCode(row) {
  loading.value = true
  doHttpGet('/product-assistant/sapi/qrSyncJobs/qrCode/grab', { id: row.id }).then((res) => {
    refTable?.value.refresh()
    ElMessage.success('抓取成功')
    loading.value = false
  }).catch((err) => {
    ElMessage.error('抓取二维码失败')
    loading.value = false
  })
}
</script>
