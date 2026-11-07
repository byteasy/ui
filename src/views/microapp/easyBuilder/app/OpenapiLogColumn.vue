<template>
  <el-space direction="horizontal" :size="4">
    <el-popconfirm
      :confirm-button-text="$t('ok')"
      :cancel-button-text="$t('cancel')"
      :title="$t('platform.ebApp.replayWarn')"
      :hide-after="10"
      v-if="hasPermission('4HwL8kGjA')"
      @confirm="onReplay()"
    >
      <template #reference>
        <el-link underline="never" type="danger" v-if="hasPermission('4HwL8kGjA')">
          {{ t('platform.ebApp.replay') }}
        </el-link>
      </template>
    </el-popconfirm>
  </el-space>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import { useSessionStore } from '@/stores/session.ts';
import { executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';

const { t, locale } = useI18n();
const { open } = useModal();
const { hasPermission } = useSessionStore();

const props = defineProps<{
  row: object;
  queryParams: Record<string, unknown>;
}>();

function onReplay() {
  executeOpenApi('4HwL8kGjA', { id: props.row.id }, {}).then(() => {
    ElMessage.success(t('operationSuccess'));
  });
}
</script>
