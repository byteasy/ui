<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle">
      <el-card :style="renderCss(props.formDefine.properties)">
        <template #header>
          <div class="card-header">
            <span>{{
              getLangText(
                props.formDefine.properties.title || '{"zh_CN":"标题","en":"title"}',
                locale,
              )
            }}</span>
          </div>
        </template>
        <template v-for="root in children" :key="root.id">
          <be-render-component
            class="w-full"
            :form-define="root"
            v-model="formValue"
            v-model:cascade-model="cascadeModel"
          />
        </template>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineModel, ref } from 'vue';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import BeRenderComponent from './BeRenderComponent.vue';

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
<style scoped></style>
