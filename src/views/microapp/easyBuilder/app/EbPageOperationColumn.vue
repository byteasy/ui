<template>
  <el-space direction="horizontal" :size="4">
    <el-link underline="never" type="primary" @click="openDesigner">
      {{ t('platform.ebApp.page') }}
    </el-link>
  </el-space>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import BeFormDesigner from '@/components/form/BeFormDesigner.vue';
import { defineEmits } from 'vue';

const { t } = useI18n();
const { open } = useModal();
const emit = defineEmits(['refresh']);

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
</script>
