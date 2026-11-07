<template>
  <el-space direction="horizontal" :size="4">
    <el-link underline="never" type="primary" @click="openDesigner">
      {{ t('platform.ebApp.page') }}
    </el-link>
    <el-link
      underline="never"
      type="primary"
      @click="openPublicLink"
      v-if="hasPermission('4TWaq6uLJ')"
    >
      {{ t('platform.ebApp.link') }}
    </el-link>
  </el-space>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import BeFormDesigner from '@/components/form/BeFormDesigner.vue';
import { defineEmits } from 'vue';
import { useSessionStore } from '@/stores/session.ts';
import { executeOpenApi } from '@/api/common/platform';
import { copyToClipboard } from '@/util/common.ts';

const { t } = useI18n();
const { open } = useModal();
const emit = defineEmits(['refresh']);
const { hasPermission } = useSessionStore();

const props = defineProps<{
  row: object;
  queryParams: Record<string, unknown>;
}>();

function openDesigner() {
  open(
    BeFormDesigner,
    {
      row: props.row,
    },
    {
      title: t('table.edit') + t('platform.ebApp.page'),
      width: '100%',
      footer: true,
      onClose: (data) => {
        emit('refresh');
      },
    },
  );
}

function openPublicLink() {
  executeOpenApi('4TWaq6uLJ', {}, props.row).then((result) => {
    const link = window.location.origin + result.data.contextPath + '/common/index.html#/pub/eb/' + result.data.code;
    copyToClipboard(link);
    window.open(link);
  });
}
</script>
