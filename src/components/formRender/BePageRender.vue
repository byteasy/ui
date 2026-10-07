<template>
  <div class="h-full w-full flex-column">
    <template v-for="root in formDefine" :key="root.id">
      <be-render-component
        :form-define="root"
        v-model:cascade-model="cascadeModel"
        v-model="formValue"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineModel, ref } from 'vue';
import BeRenderComponent from '@/components/formRender/BeRenderComponent.vue';

const formValue = defineModel<any>('modelValue', { default: () => {} });
const formDefine = defineModel<any>('formDefine', { default: () => [] });
const cascadeModel = ref({});

defineExpose({});
</script>
<style scoped></style>
