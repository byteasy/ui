<template>
  <tuna-table
    ref="refTable"
    base-url="/product-assistant/sapi/modelEnvPubNos"
    context="product-assistant"
    class-name="com.tuna.productAssistant.entity.ModelEnvPubNo"
    :query-params="{ descColumns: ['createdTime'] }"
    :row-db-click="() => {}"
    :form-component="ModelEnvPubNoForm"
  >
    <template v-slot:formItemField_modelCode="modelCodeScope">
      <dictionary-select code="product_model" v-model="modelCodeScope.queryParam.modelCode" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formItemField_engineModel="engineModelScope">
      <dictionary-select code="engine_model" v-model="engineModelScope.queryParam.engineModel" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ModelEnvPubNoForm
  from '@/views/microapp/productAssistant/modelEnvPubNo/ModelEnvPubNoForm.vue'


const refTable = ref(null)


</script>
