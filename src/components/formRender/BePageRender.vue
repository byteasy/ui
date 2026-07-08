<template>
  <div class="h-full w-full flex-column">
    <template v-for="root in rootComponents" :key="root.id">
      <be-render-component :form-define="root" :model-value="formValue"/>
    </template>
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from "vue";
import BeRenderComponent from "@/components/formRender/BeRenderComponent.vue";

const props = defineProps<{
  modelValue: Record<string, any>
  formDefine: Array<any>
}>()

const formValue = ref({...props.modelValue})
const rootComponents = ref([...(props.formDefine || [])])
const emit = defineEmits(['update:modelValue'])

watch(formValue, (newVal, oldVal) => {
  emit('update:modelValue', formValue.value)
}, {deep: true})

defineExpose({})
</script>
<style scoped>
</style>
