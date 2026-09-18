<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :max="600">
      <resource-category-group-tree @tree-node-click="onGroupClick" />
    </el-splitter-panel>
    <el-splitter-panel>
      <be-std-page-layout
        :class-name="metaData.className"
        :query-params="metaData.queryParams"
        class="h-full"
      />
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ResourceCategoryGroupTree from '@/views/microapp/platformConfig/dictionary/ResourceCategoryGroupTree.vue';
import BeStdPageLayout from '@/views/template/BeStdPageLayout.vue';

const { t, locale } = useI18n();

const groupId = ref(undefined);
const metaData = ref({
  className: 'com.byteasy.platform.entity.Dictionary',
  queryParams: {
    groupId: groupId.value,
  },
});

const onGroupClick = (treeNode: any) => {
  if (!(treeNode.children && treeNode.children.length > 0)) {
    metaData.value.queryParams.groupId = treeNode.id;
  }
};
</script>
