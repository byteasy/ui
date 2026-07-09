<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle">
      <el-form :style="renderCss(props.formDefine.properties)" :model="formValue"
               :label-position="props.formDefine.properties.labelPosition"
               :label-width="props.formDefine.properties.labelWidth"
               :label-suffix="props.formDefine.properties.labelSuffix"
               :hide-required-asterisk="props.formDefine.properties.hideRequiredAsterisk"
               :require-asterisk-position="props.formDefine.properties.requireAsteriskPosition"
               :inline-message="props.formDefine.properties.inlineMessage"
               :scroll-to-error="props.formDefine.properties.scrollToError">
        <template v-for="root in children" :key="root.id">
          <be-render-component class="w-full" :form-define="root" :model-value="props.modelValue"
                               @update:modelValue="(value) => emit('update:modelValue', value)"/>
        </template>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";
import BeRenderComponent from "./BeRenderComponent.vue";

const props = defineProps<{
  formDefine: {
    id: string
    name: string
    path: string
    render: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  },
  modelValue: Record<string, any>
}>()

const formValue = ref(props.modelValue)
const children = ref([...(props.formDefine.children || [])])
const emit = defineEmits(['selected', 'update:modelValue'])
const {t, locale} = useI18n()

</script>
<style scoped>
</style>
