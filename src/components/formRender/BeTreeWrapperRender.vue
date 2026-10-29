<template>
  <div :style="props.formDefine.properties.marginStyle" class="w-full">
    <be-tree
      :style="renderCss(props.formDefine.properties)"
      :api-query="props.formDefine.properties.apiQuery"
      :api-save="props.formDefine.properties.apiSave"
      :api-delete="props.formDefine.properties.apiDelete"
      :class-name="props.formDefine.properties.className"
      :parent-key="props.formDefine.properties.parentKey"
      :form-component="props.formDefine.properties.formComponent"
      :show-check-box="props.formDefine.properties.showCheckBox"
      :label="props.formDefine.properties.label"
      :children="props.formDefine.properties.children"
      :nodeKey="props.formDefine.properties.nodeKey"
      :lazy="props.formDefine.properties.lazy"
      :defaultExpandAll="props.formDefine.properties.defaultExpandAll"
      :highlightCurrent="props.formDefine.properties.highlightCurrent"
      :checkStrictly="props.formDefine.properties.checkStrictly"
      :expandOnClickNode="props.formDefine.properties.expandOnClickNode"
      :contextMenuEnable="props.formDefine.properties.contextMenuEnable"
      @node-click="onNodeClick"
    />
  </div>
</template>
<script lang="ts" setup>
import BeTree from '@/components/BeTree.vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import { defineModel } from 'vue';

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

const onNodeClick = (node) => {
  formValue.value[props.formDefine.properties.formKey] = node
}
</script>
<style scoped></style>
