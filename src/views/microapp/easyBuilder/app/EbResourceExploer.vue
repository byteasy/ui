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
    :before-edit="beforeEdit"
    :before-delete="beforeDelete"
    @nodeClick="onTreeNodeClick"
  />
</template>
<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import BeForm from '@/components/BeForm.vue';
import { useModal } from '@/components/dialog/useModal.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { executeOpenApi } from '@/api/common/platform';
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
      {
        formModel: { parentId: parentNode?.id },
        className: 'com.byteasy.platform.entity.ResourceCategory',
        apiSave: 'saveResourceCategory',
        beforeMount: generateCode,
      },
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

const beforeEdit = (nodeData: any) => {
  if (nodeData.type === 'CategoryRoot' || nodeData.type === 'CategoryChild') {
    open(
      BeForm,
      {
        formModel: { id: nodeData?.id },
        className: 'com.byteasy.platform.entity.ResourceCategory',
        apiSave: 'saveResourceCategory',
        beforeMount: loadResourceCategory,
      },
      {
        title: t('add'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshCurrentNode(nodeData);
          }
        },
      },
    );
  }
  return false;
};

const beforeDelete = (nodeData: any) => {
  if (nodeData.type === 'CategoryRoot' || nodeData.type === 'CategoryChild') {
    ElMessageBox.confirm(t('deleteWarn'), t('warning'), {
      confirmButtonText: t('ok'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        executeOpenApi('deleteResourceCategory', {}, nodeData).then(() => {
          ElMessage.success(t('operationSuccess'));
          refBeTree.value?.refreshCurrentNode(nodeData);
        });
      })
  }
  return false;
};

const loadResourceCategory = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('listResourceCategory', { id: formModel.id }, {})
      .then((rsp) => {
        Object.assign(formModel, rsp.data[0]);
        resolve(formModel);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const generateCode = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('genEntityCode', {}, {})
      .then((rsp) => {
        formModel.code = rsp.data;
        resolve(formModel.code);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
</script>
