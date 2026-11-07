<template>
  <el-splitter class="h-full">
    <el-splitter-panel size="20%" collapsible>
      <api-script-helper class="pr-2" :height="props.height" />
    </el-splitter-panel>
    <el-splitter-panel size="50%" collapsible :min="300">
      <be-src-editor v-model="scriptRow.script" :height="props.height" />
    </el-splitter-panel>
    <el-splitter-panel class="pl-2" collapsible>
      <api-script-debug :height="props.height" :row="scriptRow" :open-api="openApi" />
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, defineModel } from 'vue';
import { executeOpenApi } from '@/api/common/platform';
import ApiScriptHelper from '@/views/microapp/easyBuilder/app/ApiScriptHelper.vue';
import ApiScriptDebug from '@/views/microapp/easyBuilder/app/ApiScriptDebug.vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['close']);
const { t, locale } = useI18n();

const props = defineProps<{
  height?: number;
}>();

const scriptRow = defineModel<any>('row', { default: () => ({}) });
const openApi = defineModel<any>('openApi', { default: () => null });

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    executeOpenApi('saveScript', {}, scriptRow.value).then((response) => {
      scriptRow.value = response.data;
      emit('close', scriptRow.value);
    });
  } else if (btnName === 'save') {
    executeOpenApi('saveScript', {}, scriptRow.value).then((response) => {
      scriptRow.value = response.data;
      ElMessage.success(t('operationSuccess'));
    });
  } else {
    emit('close', undefined);
  }
}

defineExpose({ onButtonClick });
</script>
