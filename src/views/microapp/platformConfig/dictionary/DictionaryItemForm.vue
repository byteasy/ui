<template>
  <be-table-form ref="refForm">
    <template v-slot:formItemField_dictionaryId="scope">
      <dictionary-select v-model="scope.row.dictionaryId" :group-id="scope.row.groupId"/>
    </template>
  </be-table-form>
</template>
<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import {useI18n} from "vue-i18n";
import DictionarySelect from "@/views/microapp/platformConfig/dictionary/DictionarySelect.vue";

const {t, locale} = useI18n()

const refForm = ref(null)
function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

defineExpose({
  onButtonClick
})
</script>
