<template>
  <div :style="props.formDefine.properties.marginStyle" class="w-full h-full">
    <be-std-page-layout
      :query-params="formValue"
      :style="renderCss(props.formDefine.properties)"
      :class-name="props.formDefine.properties.className"
    />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import { defineModel } from 'vue';
import BeStdPageLayout from '@/views/template/BeStdPageLayout.vue';

const props = defineProps<{
  formDefine: {
    id: string;
    name: string;
    path: string;
    render: string;
    icon: string;
    propsForm: Array<object>;
    properties: object;
    children: any[];
  };
}>();

const formValue = defineModel<any>('modelValue', { default: () => {} });
const cascadeModel = defineModel<any>('cascadeModel', { default: () => {} });

const emit = defineEmits(['click', 'selected', 'update:modelValue']);
const { t, locale } = useI18n();

</script>
<style scoped>
</style>
