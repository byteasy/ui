<template>
  <tuna-table-form>
    <template v-slot:formItemField_modelCode="modelCodeScope">
      <dictionary-select code="product_model"
                         v-model="modelCodeScope.row[modelCodeScope.column.name]"
                         style="width: 300px" :disabled="modelCodeScope.props.readonly" clearable />
    </template>
    <template v-slot:formItemField_engineModel="engineModelScope">
      <dictionary-select code="engine_model"
                         v-model="engineModelScope.row[engineModelScope.column.name]"
                         style="width: 300px" :disabled="engineModelScope.props.readonly"
                         clearable />
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
</script>
