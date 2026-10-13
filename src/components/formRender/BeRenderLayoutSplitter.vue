<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle" class="w-full">
      <el-splitter
        :layout="props.formDefine.properties.layout"
        :lazy="props.formDefine.properties.lazy"
        :style="renderCss(props.formDefine.properties)"
      >
        <template v-for="root in children" :key="root.id">
          <el-splitter-panel
            :size="root.properties.size"
            :min="root.properties.min"
            :max="root.properties.max"
            :resizable="root.properties.resizable"
            :collapsible="root.properties.collapsible"
          >
            <be-render-component
              class="w-full"
              :form-define="root"
              v-model="formValue"
              v-model:cascade-model="cascadeModel"
            />
          </el-splitter-panel>
        </template>
      </el-splitter>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineModel, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import BeRenderComponent from '@/components/formRender/BeRenderComponent.vue';

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

const children = ref([...(props.formDefine.children || [])]);
const emit = defineEmits(['selected', 'update:modelValue']);
const { t, locale } = useI18n();
</script>
