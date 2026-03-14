<template>
  <tuna-table
    ref="refTable"
    base-url="/platform/sapi/schemaDefines"
    context="platform"
    class-name="com.tuna.platform.entity.SchemaDefine"
    :query-params="{ ascColumns: ['className', 'showOrder'] }"
  >
    <template v-slot:formQueryButtonExt
      ><el-button type="primary" icon="Loading" @click="onSyncSchemaClick">{{
        $t('platformGroup.syncSchema')
      }}</el-button></template
    >
    <template v-slot:table_column_className="scope"
      ><el-link @click="doResearch(scope.row)">{{ scope.row.className }}</el-link></template
    >
    <template v-slot:table_column_showOrder="scope"
      >
        <el-input-number
          v-model="scope.row.showOrder"
          :min="1"
          :max="60000"
          size="small"
          @change="saveShowOrder(scope.row)"
        />
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { doHttpPost, putEntitySchema } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // 表单引用

const refTable = ref(null)

function onSyncSchemaClick() {
  const queryParam = refTable.value.queryParam
  putEntitySchema(queryParam.className)
    .then((response) => {
      ElMessage.success(t('operationSuccess'))
      refTable.value.refresh()
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('operationFailed'))
    })
}

function doResearch(row) {
  refTable.value.queryParam.className = row.className
  refTable.value.refresh()
}

function saveShowOrder(row) {
  doHttpPost('/platform/sapi/schemaDefines', {}, row)
    .then(() => {
      ElMessage.success(t('operationSuccess'))
      refTable.value.refresh()
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('operationFailed'))
    })
}
</script>
