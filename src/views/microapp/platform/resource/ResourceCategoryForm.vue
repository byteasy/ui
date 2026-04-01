<template>
  <tuna-table-form>
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
import TunaI18nInput from '@/components/TunaI18nInput.vue'
</script>
