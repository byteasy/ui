<template>
  <tuna-table-form>
    <template v-slot:formItemField_groupId="scope">
      <el-select
        v-model="scope.row.groupId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResourceGroups"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <el-select
        v-model="scope.row.parentId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResources"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
    <template v-slot:formItemField_name="scope">
      <tuna-i18n-input
        :code="scope.row.code"
        v-model="scope.row.name"
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
      </tuna-i18n-input>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'

const parentResourceGroups = ref([])
const parentResources = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResourceGroups.value = res.data.records
  })

  doHttpGet('/platformSvr/sapi/resources', {
    current: 1,
    size: 10000,
    ascColumns: ['parentId', 'showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})
</script>
