<template>
  <el-splitter>
    <el-splitter-panel size="300" collapsible :min="300" :max="600">
      <eb-resource-exploer @nodeClick="onTreeNodeClick" />
    </el-splitter-panel>
    <el-splitter-panel :min="200" class="pl-2">
      <el-tabs v-model="activeName" class="h-full">
        <el-tab-pane
          :label="
            $t('platform.ebApp.model') + (activeTreeNode ? '(' + activeTreeNode?.id + ')' : '')
          "
          name="model"
          class="h-full"
        >
          <tab-entity :resource="activeTreeNode" />
        </el-tab-pane>
        <el-tab-pane
          :label="
            $t('platform.ebApp.pageLayout') + (activeTreeNode ? '(' + activeTreeNode?.id + ')' : '')
          "
          name="pageLayout"
          class="h-full"
        >
          <tab-layout :resource="activeTreeNode" />
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.permission')" name="permission" class="h-full">
          <tab-permission :resource="activeTreeNode" v-if="activeName === 'permission'" />
        </el-tab-pane>
        <el-tab-pane
          :label="
            $t('platform.ebApp.page') + (activeTreeNode ? '(' + activeTreeNode?.id + ')' : '')
          "
          name="page"
          class="h-full"
        >
          <tab-eb-page :resource="activeTreeNode" v-if="activeName === 'page'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.router')" name="router" class="h-full">
          TODO
        </el-tab-pane>
      </el-tabs>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import TabEntity from '@/views/microapp/easyBuilder/app/TabEntity.vue';
import TabLayout from '@/views/microapp/easyBuilder/app/TabLayout.vue';
import TabPermission from '@/views/microapp/easyBuilder/app/TabPermission.vue';
import EbResourceExploer from '@/views/microapp/easyBuilder/app/EbResourceExploer.vue';
import TabEbPage from '@/views/microapp/easyBuilder/app/TabEbPage.vue';
import { useI18n } from 'vue-i18n';

const activeName = ref('model');
const activeTreeNode = ref(undefined);
const { locale } = useI18n();

function onTreeNodeClick(data) {
  activeTreeNode.value = data;
}
</script>
