<template>
  <div class="h-full w-full flex-column">
    <el-form v-model="modelValue" class="w-full">
      <template v-for="root in rootComponents" :key="root.id">
        <be-render-component :form-define="root"/>
      </template>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import BeRenderComponent from "@/components/formRender/BeRenderComponent.vue";

const props = defineProps<{
  height: number | undefined
  modelValue?: object
  formDefine: Array<any>
}>()

const modelValue = ref(props.modelValue)
const rootComponents = ref([...(props.formDefine || [])])

defineExpose({})
</script>
<style scoped>
</style>
