<template>
  <tuna-table-form>
    <template v-slot:formItemField_categoryId="scope">
      <el-select
        v-model="scope.row.categoryId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in resourceCategorys"
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

const resourceCategorys = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceCategorys', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    resourceCategorys.value = res.data.records
  })
})
</script>
