<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_categoryId="scope">
      <resource-category-tree-select v-model="scope.row.categoryId" clearable filterable :placeholder="getLangText(scope.column.displayName, locale)"
                                     :disabled="scope.props.readonly"/>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {defineExpose, onMounted, ref} from 'vue'
import { doHttpGet } from '@/api/common/platform'
import ResourceCategoryTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryTreeSelect.vue";
import {useI18n} from "vue-i18n";
import {getLangText} from "@/locales/common.ts";
const {t, locale} = useI18n()

const resourceCategorys = ref([])
const refForm = ref<HTMLFormElement>()

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceCategorys', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    resourceCategorys.value = res.data.records
  })
})

function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

defineExpose({
  onButtonClick
})
</script>
