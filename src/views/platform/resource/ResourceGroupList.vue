<template>
  <tuna-table ref="refTable" base-url="/platform/sapi/resourceGroups" context="platform" class-name="com.tuna.platform.entity.ResourceGroup" :query-params="{ ascColumns: ['showOrder'] }">
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
import { doHttpPost } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // 表单引用

const refTable = ref(null)
function saveShowOrder(row) {
  doHttpPost('/platform/sapi/resourceGroups', {}, row)
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
