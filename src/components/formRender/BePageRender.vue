<template>
  <div class="h-full w-full flex-column">
    <template v-for="root in formDefine" :key="root.id">
      <be-render-component
        ref="renderRefs"
        :form-define="root"
        class="w-full h-full"
        v-model:cascade-model="cascadeModel"
        v-model="formValue"
        @close="(arg) => $emit('close', arg)"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineExpose, defineModel, ref } from 'vue';
import BeRenderComponent from '@/components/formRender/BeRenderComponent.vue';

const emit = defineEmits(['close']);
const renderRefs = ref<any[]>([]);

const formValue = defineModel<any>('modelValue', { default: () => {} });
const formDefine = defineModel<any>('formDefine', { default: () => [] });
const cascadeModel = ref({});

async function onButtonClick(btnName) {
  if (btnName === 'ok') {
    try {
      const results = await Promise.all(
        renderRefs.value.map((comp) => {
          if (comp?.onOkClick) {
            return comp.onOkClick();
          }
          return Promise.resolve(true);
        })
      );

      // 所有子组件均处理/校验成功
      console.log('所有子组件确认完成', results);
      // emit('close');
    } catch (err) {
      console.warn('某个子组件校验未通过', err);
    }
  } else if (btnName === 'cancel') {
    emit('close');
  }
}

defineExpose({ onButtonClick });
</script>

<style scoped></style>
