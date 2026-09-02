<template>
  <be-tree
    ref="refBeTree"
    api-query="getEbAppTree"
    api-save="saveEbAppTreeNode"
    api-delete="deleteEbAppTreeNode"
    node-key="code"
    parent-key="id"
    :lazy="true"
    :before-add="beforeAdd"
    @nodeClick="onTreeNodeClick"
  />
</template>
<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import BeForm from '@/components/BeForm.vue';
import { useModal } from '@/components/dialog/useModal.ts';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { open } = useModal();
const { t } = useI18n();

const refBeTree = ref(null);
const emit = defineEmits(['nodeClick']);

function onTreeNodeClick(data) {
  emit('nodeClick', data);
}

const beforeAdd = (parentNode) => {
  // 根节点，添加ResourceCategory，返回false，直接通过便捷表单添加
  if (!parentNode || 'CategoryRoot' === parentNode.type) {
    open(
      BeForm,
      { formModel: { parentId: parentNode?.id }, className: 'com.byteasy.platform.entity.ResourceCategory', apiSave: 'saveResourceCategory' },
      {
        title: t('add'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshCurrentNode(parentNode);
          }
        },
      },
    );
    return false;
  }
  if ('CategoryChild' === parentNode.type) {
    return false;
  }
  return false;
};
</script>
