<template>
  <tuna-table
    ref="refTable"
    base-url="/platformSvr/sapi/resources"
    context="platformSvr"
    class-name="com.tuna.platform.entity.Resource"
    :form-component="ResourceForm"
    :query-params="{ ascColumns: ['showOrder'] }"
  >
    <template v-slot:table_column_groupId="scope">
      {{ scope.row.groupName }}
    </template>
    <template v-slot:table_column_parentId="scope">
      {{ scope.row.parentName }}
    </template>
    <template v-slot:table_column_icon="iconScope">
      <tuna-svg-icon :svg="iconScope.row.icon" />
    </template>
    <template v-slot:formItemField_groupId="scope">
      <resource-group-select v-model="scope.queryParam.groupId"
                             filterable
                             clearable
                             style="width: 200px"
                             :placeholder="scope.column.displayName"
                             @change="refTable.refresh()"></resource-group-select>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import ResourceForm from "@/views/microapp/developConfig/resource/ResourceForm.vue";
import ResourceGroupSelect from "@/views/microapp/developConfig/resource/ResourceGroupSelect.vue";
import {ref} from "vue";

const refTable = ref(null)
</script>
