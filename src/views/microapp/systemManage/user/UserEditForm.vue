<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_username="scope">
      <el-input v-model="scope.row.username" :disabled="scope.row.id !== undefined"
                type="text"/>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";

const refForm = ref(null)

onMounted(() => {
  if (refForm.value.formValue.id === undefined) {
    refForm.value.formValue.status = 'NORMAL'
    refForm.value.formValue.userType = 'NORMAL'
  }
})
</script>
