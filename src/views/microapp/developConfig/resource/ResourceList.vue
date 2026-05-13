<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :max="600">
      <resource-category-group-tree @tree-node-click="onGroupClick"/>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table-v2
        ref="refTable"
        base-url="/platformSvr/sapi/resources"
        context="platformSvr"
        class-name="com.tuna.platform.entity.Resource"
        :form-component="ResourceForm"
        :row-key="'id'"
        :tree-props="{ children: 'childrenList' }"
        class="pl-1"
        :row-db-click="row => {}"
        :pagination-visible="0"
      >
        <template v-slot:form-query-buttons>
          <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
              $t('search')
            }}
          </el-button>
          <el-button type="primary" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
        </template>
        <template v-slot:table-cell-icon="iconScope">
          <tuna-svg-icon :svg="iconScope.row.icon" v-if="iconScope.row.icon"/>
          <span v-else>-</span>
        </template>
      </tuna-table-v2>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import ResourceForm from "@/views/microapp/developConfig/resource/ResourceForm.vue";
import ResourceCategoryGroupTree
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTree.vue";

const refTable = ref(null)

function onGroupClick(treeNode) {
  if(!(treeNode.children && treeNode.children.length > 0)) {
    refTable.value.queryParam.groupId = treeNode.id
    refTable.value?.refresh()
  }
}

function onAdd() {
  refTable.value?.onAdd({ groupId: refTable.value.queryParam.groupId })
}
</script>
