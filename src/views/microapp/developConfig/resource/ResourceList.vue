<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :max="600">
      <resource-category-group-tree />
    </el-splitter-panel>
    <el-splitter-panel size="250" collapsible :max="600">
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table-v2
        ref="refTable"
        base-url="/platformSvr/sapi/resources"
        context="platformSvr"
        class-name="com.tuna.platform.entity.Resource"
        :form-component="ResourceForm"
        :query-params="{ ascColumns: ['showOrder'] }"
        class="pl-1"
      >
        <template v-slot:table-cell-groupId="scope">
          <tuna-i18n-value :model-value="scope.row.groupName" />
        </template>
        <template v-slot:table-cell-parentId="scope">
          <tuna-i18n-value :model-value="scope.row.parentName" />
        </template>
        <template v-slot:table-cell-icon="iconScope">
          <tuna-svg-icon :svg="iconScope.row.icon" />
        </template>
      </tuna-table-v2>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import ResourceForm from "@/views/microapp/developConfig/resource/ResourceForm.vue";
import ResourceGroupSelect from "@/views/microapp/developConfig/resource/ResourceGroupSelect.vue";
import ResourceCategoryGroupTree from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTree.vue";
import {ref} from "vue";

const refTable = ref(null)
</script>
