<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_groupId="scope">
      <div style="width: 300px">
        <resource-category-group-tree-select v-model="scope.row.groupId" @change="loadParentTree"/>
      </div>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <div style="width: 300px">
        <resource-tree-select v-model="scope.row.parentId" ref="refParentTree"/>
      </div>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";
import ResourceTreeSelect from "@/views/microapp/developConfig/resource/ResourceTreeSelect.vue";

const refParentTree = ref(null)
const refForm = ref(null)

onMounted(() => {
  loadParentTree()
})

function loadParentTree() {
  refParentTree.value.queryParams.groupId = refForm.value.formValue.groupId
  refParentTree.value.refresh()
}
</script>
