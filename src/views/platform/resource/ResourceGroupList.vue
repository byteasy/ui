<template>
  <el-splitter>
    <el-splitter-panel size="260" :resizable="false">
      <tuna-table
        ref="refTableCategory"
        base-url="/platformSvr/sapi/resourceCategorys"
        context="platformSvr"
        class-name="com.tuna.platform.entity.ResourceCategory"
        :query-params="{ ascColumns: ['showOrder'] }"
        :operation-column-width="0"
        :pagination-visible="0"
        :query-form-visible="0"
        :form-component="ResourceCategoryForm"
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
              <div class="flex-row align-items-center w-full">
                <div class="flex-grow">{{ scope.row.name }}</div>
                <div class="flex-none">
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
                </div>
              </div>

            </template>
          </el-table-column>
        </template>
      </tuna-table>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table
        ref="refTable"
        base-url="/platformSvr/sapi/resourceGroups"
        context="platformSvr"
        class-name="com.tuna.platform.entity.ResourceGroup"
        :query-params="{ ascColumns: ['showOrder'] }"
        class="pl-2"
        :form-component="ResourceGroupForm"
      >
        <template v-slot:formQueryButton>
          <el-button type="primary" icon="Search" @click="refTable.refresh()">{{
              $t('search')
            }}</el-button>
          <el-button type="primary" @click="onGroupAddClick" icon="Plus">{{ $t('add') }}</el-button>
        </template>
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
import ResourceCategoryForm from '@/views/platform/resource/ResourceCategoryForm.vue'
import ResourceGroupForm from '@/views/platform/resource/ResourceGroupForm.vue'
const { t } = useI18n()

const refTable = ref(null)
const refTableCategory = ref(null)
const currentCategory = ref({})

function saveShowOrder(row) {
  doHttpPost('/platformSvr/sapi/resourceGroups', {}, row)
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
  currentCategory.value = row
  refTable.value.queryParam.categoryId = row.id
  refTable.value.refresh()
}

const onGroupAddClick = () => {
  refTable.value.onAdd({ categoryId: currentCategory.value.id })
}
</script>
