<template>
  <el-splitter>
    <el-splitter-panel size="220" collapsible :min="220">
      <be-tree
        ref="treeRefCategory"
        api-query="4GViiNqQs"
        :query-params="props.queryParams"
        @node-click="onResourceGroupClick"
        default-expand-all
      />
    </el-splitter-panel>
    <el-splitter-panel size="320" collapsible :min="320">
      <be-tree
        ref="treeRefResource"
        api-query="4GJc62jqs"
        :query-params="resourceParams"
        :data-load-finished="loadGroupPermissions"
        show-check-box
        default-expand-all
      />
    </el-splitter-panel>
  </el-splitter>
</template>
<script lang="ts" setup>
import { defineEmits, defineExpose, ref } from 'vue';
import { executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

const treeRefResource = ref(null);

const props = defineProps<{
  role: object;
  queryParams: Record<string, unknown>;
}>();
const emit = defineEmits(['close']);
const { t } = useI18n();
const resourceParams = ref({ groupId: undefined });

function loadGroupPermissions() {
  // 查询角色拥有的权限
  executeOpenApi(
    '4GTmdZSgs',
    { roleId: props.role.id, groupId: resourceParams.value.groupId },
    {},
  ).then((rsp) => {
    for (const key of rsp.data) {
      const node = treeRefResource.value.getNode(String(key));
      if(node.isLeaf === true) {
        treeRefResource.value?.setChecked(key, true, false);
      }
    }
  });
}

function onResourceGroupClick(data: any) {
  if (data.groupId) {
    resourceParams.value.groupId = data.groupId;
  }
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    const keys = treeRefResource.value?.getCheckedKeys();
    const halfKeys = treeRefResource.value?.getHalfCheckedKeys();
    for (const key of halfKeys) {
      keys.push(key);
    }
    const menus = [];
    const apis = [];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('entity') < 0 && keys[i].indexOf('openapi') < 0) {
        menus.push({ roleId: props.role.id, resourceId: keys[i] });
      }
      if (keys[i].indexOf('openapi') >= 0) {
        apis.push({ roleId: props.role.id, openapiId: keys[i].replace('openapi-', '') });
      }
    }
    executeOpenApi(
      '4GUf7FyQs',
      { roleId: props.role.id, groupId: resourceParams.value.groupId },
      { menus: menus, apis: apis },
    )
      .then(() => {
        ElMessage.success(t('operationSuccess'));
        emit('close', 'ok');
      })
      .catch((err) => {
        ElMessage.error(err.message);
      });
  } else {
    emit('close', 'cancel');
  }
}

defineExpose({ onButtonClick });
</script>
