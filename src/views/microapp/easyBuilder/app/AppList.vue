<template>
  <el-splitter>
    <el-splitter-panel size="300" collapsible :min="300" :max="600">
      <eb-resource-exploer @nodeClick="onTreeNodeClick"/>
    </el-splitter-panel>
    <el-splitter-panel :min="200" class="pl-2">
      <el-tabs v-model="activeName" class="h-full">
        <el-tab-pane :label="$t('platform.ebApp.model')" name="model" class="h-full">
          <tab-entity v-if="activeName === 'model'" :resource="activeTreeNode"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.pageLayout')" name="pageLayout" class="h-full">
          <tab-layout v-if="activeName === 'pageLayout'" :resource="activeTreeNode"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.permission')" name="permission" class="h-full">
          <tab-permission v-if="activeName === 'permission'" :resource="activeTreeNode"/>
        </el-tab-pane>
      </el-tabs>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import {ref} from "vue";
import TabEntity from "@/views/microapp/easyBuilder/app/TabEntity.vue";
import TabLayout from "@/views/microapp/easyBuilder/app/TabLayout.vue";
import TabPermission from "@/views/microapp/easyBuilder/app/TabPermission.vue";
import EbResourceExploer from '@/views/microapp/easyBuilder/app/EbResourceExploer.vue';

const activeName = ref('model')
const activeTreeNode = ref(undefined)

function onTreeNodeClick(data) {
  activeTreeNode.value = data
}
</script>
