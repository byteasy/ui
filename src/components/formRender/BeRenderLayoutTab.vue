<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle" class="w-full">
      <el-tabs
        v-model="editableTabsValue"
        :type="props.formDefine.properties.type"
        :tab-position="props.formDefine.properties.tabPosition"
        :style="renderCss(props.formDefine.properties)"
      >
        <template v-for="root in children" :key="root.id">
          <el-tab-pane :label="getLangText(root.properties.title, locale)" :name="root.id">
            <be-render-component
              class="w-full"
              :form-define="root"
              v-model="formValue"
              v-model:cascade-model="cascadeModel"
            />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineModel, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import { getLangText } from '@/locales/common.ts';
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
  modelValue: Record<string, any>;
}>();
const formValue = defineModel<any>('modelValue', { default: () => {} });
const cascadeModel = defineModel<any>('cascadeModel', { default: () => {} });

const children = ref([...(props.formDefine.children || [])]);
const emit = defineEmits(['selected']);
const { t, locale } = useI18n();
const editableTabsValue = ref(children.value.length > 0 ? children.value[0].id : undefined);
</script>
