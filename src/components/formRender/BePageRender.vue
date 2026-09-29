<template>
  <div class="h-full w-full flex-column">
    <template v-for="root in formDefine" :key="root.id">
      <be-render-component :form-define="root" v-model="formValue" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineModel, ref, watch } from 'vue';
import BeRenderComponent from '@/components/formRender/BeRenderComponent.vue';

const props = defineProps<{
  modelValue: Record<string, any>;
}>();

const formValue = ref({ ...props.modelValue });
const formDefine = defineModel<any>('formDefine', { default: () => [] });

const emit = defineEmits(['update:modelValue']);

watch(
  formValue.value,
  (newVal, oldVal) => {
    emit('update:modelValue', newVal);
  },
  { deep: true },
);

defineExpose({});
</script>
<style scoped></style>
