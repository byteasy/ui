<template>
  <be-tree
    ref="refBeTree"
    api-query="getEbAppTree"
    api-save="saveEbAppTreeNode"
    api-delete="deleteEbAppTreeNode"
    node-key="code"
    parent-key="parentId"
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
        apiCascade: 'cascadeResourceCategory',
        beforeMount: generateCode,
      },
      {
        title: t('add') + t('platform.ebApp.resourceCategory'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshNodeAndExpand(parentNode);
          }
        },
      },
    );
  } else if ('CategoryChild' === parentNode.type) {
    // 添加service instance
    open(
      BeForm,
      {
        formModel: { categoryId: parentNode?.id, status: 'ENABLE' },
        className: 'com.byteasy.platform.entity.ServiceInstance',
        apiSave: 'saveServiceInstance',
      },
      {
        title: t('add') + t('platform.ebApp.serviceInstance'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshNodeAndExpand(parentNode);
          }
        },
      },
    );
  } else if ('Service' === parentNode.type) {
    // 添加 Resource Group
    open(
      BeForm,
      {
        formModel: { serviceCode: parentNode?.code, isMicroapp: 'YES', navbarMenu: 'NO', categoryId: parentNode?.categoryId },
        className: 'com.byteasy.platform.entity.ResourceGroup',
        apiSave: 'saveResourceGroup',
        apiCascade: 'cascadeResourceGroup',
      },
      {
        title: t('add') + t('platform.ebApp.resourceGroup'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshNodeAndExpand(parentNode);
          }
        },
      },
    );
  } else if ('ResourceGroup' === parentNode.type) {
    // 添加 Resource
    open(
      BeForm,
      {
        formModel: { parentId: null, groupId: parentNode.id },
        className: 'com.byteasy.platform.entity.Resource',
        apiSave: 'saveResource',
        apiCascade: 'cascadeResource',
      },
      {
        title: t('add') + t('platform.ebApp.resource'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshNodeAndExpand(parentNode);
          }
        },
      },
    );
  } else if ('Resource' === parentNode.type ) {
    // 添加 Resource
    open(
      BeForm,
      {
        formModel: { parentId: parentNode.id },
        className: 'com.byteasy.platform.entity.Resource',
        apiSave: 'saveResource',
        apiCascade: 'cascadeResource',
        beforeMount: loadResourceRef,
      },
      {
        title: t('add') + t('platform.ebApp.resource'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshNodeAndExpand(parentNode);
          }
        },
      },
    );
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
        apiCascade: 'cascadeResourceCategory',
        beforeMount: loadResourceCategory,
      },
      {
        title: t('table.edit')  + t('platform.ebApp.resourceCategory'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshCurrentNode(nodeData);
          }
        },
      },
    );
  } else if (nodeData.type === 'Service') {
    open(
      BeForm,
      {
        formModel: { id: nodeData?.id },
        className: 'com.byteasy.platform.entity.ServiceInstance',
        apiSave: 'saveServiceInstance',
        beforeMount: loadServiceInstance,
      },
      {
        title: t('table.edit') + t('platform.ebApp.serviceInstance'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshCurrentNode(nodeData);
          }
        },
      },
    );
  } else if (nodeData.type === 'ResourceGroup') {
    open(
      BeForm,
      {
        formModel: { id: nodeData?.id },
        className: 'com.byteasy.platform.entity.ResourceGroup',
        apiSave: 'saveResourceGroup',
        apiCascade: 'cascadeResourceGroup',
        beforeMount: loadResourceGroup,
      },
      {
        title: t('table.edit') + t('platform.ebApp.resourceGroup'),
        onClose: (data) => {
          if (data === 'ok') {
            refBeTree.value?.refreshCurrentNode(nodeData);
          }
        },
      },
    );
  } else if (nodeData.type === 'Resource') {
    open(
      BeForm,
      {
        formModel: { id: nodeData?.id },
        className: 'com.byteasy.platform.entity.Resource',
        apiSave: 'saveResource',
        apiCascade: 'cascadeResource',
        beforeMount: loadResource,
      },
      {
        title: t('table.edit') + t('platform.ebApp.resource'),
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
  ElMessageBox.confirm(t('deleteWarn'), t('warning'), {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    if (nodeData.type === 'CategoryRoot' || nodeData.type === 'CategoryChild') {
      executeOpenApi('deleteResourceCategory', {}, nodeData).then(() => {
        ElMessage.success(t('operationSuccess'));
        refBeTree.value?.removeNode(nodeData);
      });
    } else if (nodeData.type === 'Service') {
      executeOpenApi('deleteServiceInstance', {}, nodeData).then(() => {
        ElMessage.success(t('operationSuccess'));
        refBeTree.value?.removeNode(nodeData);
      });
    } else if (nodeData.type === 'ResourceGroup') {
      executeOpenApi('deleteResourceGroup', {}, nodeData).then(() => {
        ElMessage.success(t('operationSuccess'));
        refBeTree.value?.removeNode(nodeData);
      });
    } else if (nodeData.type === 'Resource') {
      executeOpenApi('deleteResource', {}, nodeData).then(() => {
        ElMessage.success(t('operationSuccess'));
        refBeTree.value?.removeNode(nodeData);
      });
    }
  });
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

const loadServiceInstance = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('listServiceInstance', { id: formModel.id }, {})
      .then((rsp) => {
        Object.assign(formModel, rsp.data[0]);
        resolve(formModel);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const loadResourceGroup = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('listResourceGroup', { id: formModel.id }, {})
      .then((rsp) => {
        Object.assign(formModel, rsp.data[0]);
        resolve(formModel);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const loadResourceRef = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('getResourceByKey', { id: formModel.parentId }, {})
      .then((rsp) => {
        if(rsp.data.type === 'DIRECTORY') {
          formModel.groupId = rsp.data.groupId;
          resolve(formModel);
        } else {
          reject('platform.ebApp.resourceMenuMustHasNoChildren');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const loadResource = (formModel: any) => {
  return new Promise((resolve, reject) => {
    executeOpenApi('getResourceByKey', { id: formModel.id }, {})
      .then((rsp) => {
        Object.assign(formModel, rsp.data);
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
