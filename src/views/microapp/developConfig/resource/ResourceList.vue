<template>
  <tuna-table
    ref="refTable"
    base-url="/platformSvr/sapi/resources"
    context="platformSvr"
    class-name="com.tuna.platform.entity.Resource"
    :form-component="ResourceForm"
    :query-params="{ ascColumns: ['showOrder'] }"
  >
    <template v-slot:table_column_groupId="scope">
      {{ scope.row.groupName }}
    </template>
    <template v-slot:table_column_parentId="scope">
      {{ scope.row.parentName }}
    </template>
    <template v-slot:formItemField_groupId="scope">
      <el-select
        v-model="scope.queryParam.groupId"
        filterable
        clearable
        style="width: 200px"
        :placeholder="scope.column.displayName"
        @change="refTable.refresh()"
      >
        <el-option
          v-for="item in parentResources"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import ResourceForm from "@/views/microapp/developConfig/resource/ResourceForm.vue";
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'

const refTable = ref(null)
const parentResources = ref([])
onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})
</script>
