<template>
  <tuna-table
    ref="refTable"
    base-url="/product-assistant/sapi/printRecords"
    context="product-assistant"
    class-name="com.tuna.productAssistant.entity.PrintRecord"
    :query-params="{ descColumns: ['createdTime'] }"
    :row-db-click="() => {}"
  >
    <template v-slot:formQueryButton>
      <el-button type="primary" icon="Search" @click="refTable?.refresh">{{
          $t('search')
        }}
      </el-button>
    </template>
    <template v-slot:operationSlot="operationSlot">
      <el-button link type="primary" @click="downLoad(operationSlot.row)" >下载模板</el-button>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const refTable = ref(null)

function downLoad(row) {
  window.open('/product-assistant/sapi/printRecords/print/download?id=' + row.id, '_blank')
}
</script>
