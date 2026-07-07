<template>
  <div class="h-full w-full flex-column">
    <el-form v-model="formValue" class="w-full">
      <template v-for="root in rootComponents" :key="root.id">
        <be-render-component :form-define="root" :modelValue="formValue"/>
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

const formValue = ref({ ...props.modelValue })
const rootComponents = ref([...(props.formDefine || [])])

watch(formValue, (newVal, oldVal) => {
  console.log('modelValue', newVal)
}, { deep: true })
defineExpose({})
</script>
<style scoped>
</style>
