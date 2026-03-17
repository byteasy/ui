<template>
  <tuna-table
    base-url="/platform/sapi/resources"
    context="platform"
    class-name="com.tuna.platform.entity.Resource"
    :form-component="ResourceForm"
    :query-params="{ ascColumns: ['showOrder'] }"
  >
    <template v-slot:formItemField_groupId="scope">
      <el-select
        v-model="scope.queryParam.groupId"
        filterable
        style="width: 200px"
        :placeholder="scope.column.displayName"
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
import ResourceForm from '@/views/platform/resource/ResourceForm.vue'
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'

const parentResources = ref([])
onMounted(() => {
  doHttpGet('/platform/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})
</script>
