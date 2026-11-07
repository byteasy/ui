<template>
    <div :style="props.formDefine.properties.marginStyle" class="w-full h-full">
      <div :style="renderCss(props.formDefine.properties)">
        <template v-for="root in children" :key="root.id">
          <be-render-component
            :form-define="root"
            class="w-full h-full"
            v-model="formValue"
            v-model:cascade-model="cascadeModel"
          />
        </template>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { defineModel, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';

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
