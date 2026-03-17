<template>
  <el-splitter>
    <el-splitter-panel size="260" :resizable="false">
      <tuna-table
        ref="refTableCategory"
        base-url="/platform/sapi/resourceCategorys"
        context="platform"
        class-name="com.tuna.platform.entity.ResourceCategory"
        :query-params="{ ascColumns: ['showOrder'] }"
        :operation-column-width="0"
        :pagination-visible="0"
        :query-form-visible="0"
        @row-click="onCategoryTableRowClick"
      >
        <template v-slot:columnsSlot_name="scope">
          <el-table-column align="center" :prop="scope.column.name" stripe highlight-current-row>
            <template #header>
              <div class="flex-row align-items-center w-full">
                <div class="flex-grow"></div>
                <div class="flex-none">
                  {{ scope.column.displayName }}
                </div>
                <div class="flex-grow flex-row justify-content-end">
                  <el-button icon="Plus" circle @click="refTableCategory.onAdd()" />
                </div>
              </div>
            </template>
            <template #default="scope">
              {{ scope.row.name }}
              <el-popconfirm
                :confirm-button-text="$t('ok')"
                :cancel-button-text="$t('cancel')"
                :title="$t('deleteWarn')"
                :hide-after="10"
                @confirm="refTableCategory.onDelete(scope.row)"
              >
                <template #reference>
                  <el-button icon="Delete" type="danger" text circle class="ml-3" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </tuna-table>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table
        ref="refTable"
        base-url="/platform/sapi/resourceGroups"
        context="platform"
        class-name="com.tuna.platform.entity.ResourceGroup"
        :query-params="{ ascColumns: ['showOrder'] }"
        class="pl-2"
      >
        <template v-slot:table_column_showOrder="scope">
          <el-input-number
            v-model="scope.row.showOrder"
            :min="1"
            :max="60000"
            size="small"
            @change="saveShowOrder(scope.row)"
          />
        </template>
      </tuna-table>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { doHttpPost } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // 表单引用

const refTable = ref(null)
const refTableCategory = ref(null)

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

const onCategoryTableRowClick = (row) => {
  refTable.value.queryParam.categoryId = row.id
  refTable.value.refresh()
}
</script>
