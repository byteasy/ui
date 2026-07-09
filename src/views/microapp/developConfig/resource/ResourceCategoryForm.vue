<template>
  <tuna-table-form ref="refForm">
      <template v-slot:formItemField_parentId="scope">
        <resource-category-tree-select v-model="scope.row.parentId" clearable
                                       :disabled="scope.props.readonly"/>
      </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import ResourceCategoryTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryTreeSelect.vue";
import {defineExpose, ref} from "vue";

const refForm = ref<HTMLFormElement>();

function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

defineExpose({
  onButtonClick
})
</script>
