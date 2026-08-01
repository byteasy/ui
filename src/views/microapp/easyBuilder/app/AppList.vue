<template>
  <el-splitter>
    <el-splitter-panel size="300" collapsible :min="300" :max="600">
      <be-tree query-api-code="getEbAppTree" node-key="code" :lazy="true" />
    </el-splitter-panel>
    <el-splitter-panel :min="200" class="pl-2">
      <el-tabs v-model="activeName" class="h-full">
        <el-tab-pane :label="$t('platform.ebApp.model')" name="model"></el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.api')" name="api" class="h-full">
          <tab-api v-if="activeName === 'api'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.pageLayout')" name="pageLayout"></el-tab-pane>
        <el-tab-pane :label="$t('platform.ebApp.permission')" name="permission"></el-tab-pane>
      </el-tabs>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import {ref} from "vue";
import TabApi from "@/views/microapp/easyBuilder/app/TabApi.vue";

const activeName = ref('model')
</script>
