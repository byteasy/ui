<template>
  <div :style="props.modelValue.properties.marginStyle" class="w-full h-full">
    <be-std-page-layout
      :style="renderCss(props.modelValue.properties)"
      :class-name="props.modelValue.properties.className"
    />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import BeStdPageLayout from '@/views/template/BeStdPageLayout.vue';

const props = defineProps<{
  modelValue: {
    id: string;
    name: string;
    path: string;
    icon: string;
    propsForm: Array<object>;
    properties: object;
    children: any[];
  };
}>();

const emit = defineEmits(['click', 'selected', 'update:modelValue']);
const { t, locale } = useI18n();
</script>
<style scoped>
</style>
