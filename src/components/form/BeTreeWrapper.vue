<template>
  <div :style="props.modelValue.properties.marginStyle">
    <be-tree
      :style="renderCss(props.modelValue.properties)"
      :api-query="props.modelValue.properties.apiQuery"
      :api-save="props.modelValue.properties.apiSave"
      :api-delete="props.modelValue.properties.apiDelete"
      :class-name="props.modelValue.properties.className"
      :parent-key="props.modelValue.properties.parentKey"
      :form-component="props.modelValue.properties.formComponent"
      :show-check-box="props.modelValue.properties.showCheckBox"
      :label="props.modelValue.properties.label"
      :children="props.modelValue.properties.children"
      :nodeKey="props.modelValue.properties.nodeKey"
      :lazy="props.modelValue.properties.lazy"
      :defaultExpandAll="props.modelValue.properties.defaultExpandAll"
      :highlightCurrent="props.modelValue.properties.highlightCurrent"
      :checkStrictly="props.modelValue.properties.checkStrictly"
      :expandOnClickNode="props.modelValue.properties.expandOnClickNode"
      :contextMenuEnable="props.modelValue.properties.contextMenuEnable"
      :clearable="props.modelValue.properties.clearable"
    />
  </div>
</template>
<script lang="ts" setup>
import BeTree from '@/components/BeTree.vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';

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
<style scoped></style>
