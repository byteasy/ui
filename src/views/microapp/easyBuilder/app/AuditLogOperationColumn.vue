<template>
  <el-space direction="horizontal" :size="4">
    <el-link underline="never" type="warning" @click="openDesigner">
      {{ t('platform.ebApp.differentCompare') }}
    </el-link>
  </el-space>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import { defineEmits } from 'vue';
import BeObjectDiffView from '@/components/BeObjectDiffView.vue';

const { t } = useI18n();
const { open } = useModal();
const emit = defineEmits(['refresh']);

const props = defineProps<{
  row: object;
  queryParams: Record<string, unknown>;
}>();

function openDesigner() {
  open(
    BeObjectDiffView,
    {
      modelValue: JSON.parse(props.row.entityContent),
      oldModelValue: JSON.parse(props.row.oldEntityContent),
      className: props.row.className,
      diffFieldNames: props.row.diffFields,
    },
    {
      title: t('platform.ebApp.differentCompare'),
      width: '80%',
      footer: false,
      onClose: (data) => {
      },
    },
  );
}
</script>
