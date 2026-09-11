<template>
  <el-space direction="horizontal" :size="4">
    <el-link underline="never" type="primary" @click="onOpenRoleResource">
      {{ t('platform.ebApp.resource') }}
    </el-link>
  </el-space>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import RoleResource from '@/views/microapp/easyBuilder/app/RoleResource.vue';

const { t, locale } = useI18n();
const { open } = useModal();

const props = defineProps<{
  row: object;
  queryParams: Record<string, unknown>;
}>();

function onOpenRoleResource() {
  open(
    RoleResource,
    {
      role: props.row,
      queryParams: props.queryParams,
    },
    {
      title: t('table.edit') + t('platform.ebApp.resource') + t('platform.ebApp.permission'),
      width: '60%',
      btnExtras: [{ key: 'save', type: 'primary', icon: 'FolderChecked', name: t('save') }],
    },
  );
}
</script>
