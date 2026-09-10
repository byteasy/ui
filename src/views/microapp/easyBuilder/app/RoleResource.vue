<template>
  <be-tree
    ref="treeRef"
    api-query="4GJc62jqs"
    :query-params="props.queryParams"
    show-check-box
    default-expand-all
  />
</template>
<script lang="ts" setup>
import { defineEmits, defineExpose, onMounted, ref } from 'vue';
import { executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

const treeRef = ref(null);

const props = defineProps<{
  role: object;
  queryParams: Record<string, unknown>;
}>();
const emit = defineEmits(['close']);
const { t } = useI18n();

onMounted(() => {
  // 查询角色拥有的权限
  executeOpenApi('4GTmdZSgs', { roleId: props.role.id }, {}).then((rsp) => {
    const keys = rsp.data.map((rsp: any) => {
      return rsp.resourceId;
    });
    treeRef.value?.setCheckedKeys(keys);
  });
});

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    const keys = treeRef.value?.getCheckedKeys();
    const arrs = [];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('group') < 0) {
        arrs.push({ roleId: props.role.id, resourceId: keys[i] });
      }
    }
    executeOpenApi('4GUf7FyQs', { roleId: props.role.id }, arrs)
      .then(() => {
        ElMessage.success(t('operationSuccess'));
        emit('close', 'ok');
      })
      .catch((err) => {
        ElMessage.error(err.message);
      });
  }
}

defineExpose({ onButtonClick });
</script>
