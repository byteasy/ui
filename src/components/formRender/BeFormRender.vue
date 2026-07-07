<template>
  <div class="h-full w-full flex-column">
    <el-form :model="formValue" class="w-full" ref="refForm">
      <template v-for="root in rootComponents" :key="root.id">
        <be-render-component :form-define="root" :model-value="formValue" />
      </template>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from "vue";
import BeRenderComponent from "@/components/formRender/BeRenderComponent.vue";

const props = defineProps<{
  modelValue: Record<string, any>
  formDefine: Array<any>
}>()

const refForm = ref(null)
const formValue = ref({ ...props.modelValue })
const rootComponents = ref([...(props.formDefine || [])])
const emit = defineEmits(['update:modelValue'])

watch(formValue, (newVal, oldVal) => {
  emit('update:modelValue', formValue.value)
}, { deep: true })

defineExpose({})
</script>
<style scoped>
</style>
