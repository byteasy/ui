<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :min="200" :max="600">
      <resource-category-tree @tree-node-click="onCategoryTableRowClick"/>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table-v2
        ref="refTable"
        base-url="/platformSvr/sapi/resourceGroups"
        context="platformSvr"
        class-name="com.byteasy.platform.entity.ResourceGroup"
        :query-params="{ ascColumns: ['showOrder'] }"
        class="pl-2"
        :form-component="ResourceGroupForm"
      >
        <template v-slot:form-query-buttons>
          <el-button type="primary" icon="Search" @click="refTable.refresh()">{{
              $t('search')
            }}
          </el-button>
          <el-button type="primary" @click="onGroupAddClick" icon="Plus">{{ $t('add') }}</el-button>
        </template>
        <template v-slot:table-cell-showOrder="scope">
          <el-input-number
            v-model="scope.row.showOrder"
            :min="1"
            :max="60000"
            size="small"
            @change="saveShowOrder(scope.row)"
          />
        </template>
      </tuna-table-v2>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {doHttpPost} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {useI18n} from 'vue-i18n'
import ResourceGroupForm from '@/views/microapp/developConfig/resource/ResourceGroupForm.vue'
import ResourceCategoryTree from "@/views/microapp/developConfig/resource/ResourceCategoryTree.vue";

const {t} = useI18n()

const refTable = ref(null)
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
  refTable.value.queryParam.categoryId = [row.id]
  if (row.children !== undefined && row.children !== null) {
    row.children.forEach(item => {
      refTable.value?.queryParam.categoryId.push(item.id)
    })
  }
  refTable.value.queryParam.categoryIdQueryType = 'in'
  refTable.value.refresh()
}

const onGroupAddClick = () => {
  refTable.value.onAdd({categoryId: currentCategory.value.id})
}
</script>
