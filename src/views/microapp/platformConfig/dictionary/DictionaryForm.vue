<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_groupId="scope">
      <resource-category-group-tree-select v-model="scope.row.groupId" />
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {defineExpose, onMounted, ref} from 'vue'
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

const refForm = ref(null)

function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

defineExpose({
  onButtonClick
})
</script>
