<template>
  <el-space direction="horizontal" :size="4">
    <el-link underline="never" type="primary">
      {{ t('platform.ebApp.resource') }}
    </el-link>
    <el-link underline="never" type="primary">
      {{ t('platform.ebApp.api') }}
    </el-link>
  </el-space>
</template>
<script lang="ts" setup>
import BeTableContainer from '@/components/BeTableContainer.vue';
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';
import { getEntityDefine } from '@/api/common/platform';
import { getLangText } from '@/locales/common.ts';

const { t, locale } = useI18n();
const { open } = useModal();

const props = defineProps<{
  row: object;
  queryParams: Record<string, unknown>;
}>();

function onOpenTableDetail(row) {
  getEntityDefine('com.byteasy.platform.entity.FieldDefine').then((entityDefine) => {
    const queryParams = { row: row };
    queryParams.classNameQueryType = 'eq';
    queryParams.className = row.code;
    const metaData = {
      queryParams: queryParams,
      className: 'com.byteasy.platform.entity.FieldDefine',
      multiple: true,
    };
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: '60%',
        footer: false,
      },
    );
  });
}
</script>
