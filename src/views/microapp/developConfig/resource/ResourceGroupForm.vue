<template>
  <tuna-table-form>
    <template v-slot:formItemField_categoryId="scope">
      <resource-category-tree-select v-model="scope.row.categoryId" style="min-width: 300px" clearable filterable :placeholder="scope.column.displayName"
                                     :disabled="scope.props.readonly"/>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'
import ResourceCategoryTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryTreeSelect.vue";

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
