<template>
  <el-splitter>
    <el-splitter-panel size="300" collapsible :min="300" :max="600">
      <be-tree api-query="getEbAppTree" node-key="code" :lazy="true" @nodeClick="onTreeNodeClick"/>
    </el-splitter-panel>
    <el-splitter-panel :min="200" class="pl-2">
      <el-tabs v-model="activeName" class="h-full">
        <el-tab-pane :label="$t('platform.ebApp.model')" name="model" class="h-full">
          <tab-entity v-if="activeName === 'model'" :resource="activeTreeNode"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.api')" name="api" class="h-full">
          <tab-api v-if="activeName === 'api'" :resource="activeTreeNode"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.pageLayout')" name="pageLayout" class="h-full">
          <tab-layout v-if="activeName === 'pageLayout'" :resource="activeTreeNode"/>
        </el-tab-pane>
      </el-tabs>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import {ref} from "vue";
import TabApi from "@/views/microapp/easyBuilder/app/TabApi.vue";
import TabEntity from "@/views/microapp/easyBuilder/app/TabEntity.vue";
import TabLayout from "@/views/microapp/easyBuilder/app/TabLayout.vue";

const activeName = ref('model')
const activeTreeNode = ref(undefined)

function onTreeNodeClick(data) {
  activeTreeNode.value = data
}
</script>
