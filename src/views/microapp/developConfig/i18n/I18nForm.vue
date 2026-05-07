<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_groupId="scope">
      <resource-category-group-tree-select v-model="scope.row.groupId" />
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";

const refForm = ref(null)

</script>
