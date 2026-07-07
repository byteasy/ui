<template>
  <div :style="props.modelValue.properties.marginStyle" >
    <el-form-item :prop="props.modelValue.properties.fieldName" :label="getLangText(props.modelValue.properties.fieldTitle, locale)" :style="renderCss(props.modelValue.properties)">
      <el-slider v-model="testValue" v-if="props.modelValue.properties.component === 'slider'"
                 :min="props.modelValue.properties.min"
                 :max="props.modelValue.properties.max"
                 :show-input="props.modelValue.properties.showInput"
                 :step="props.modelValue.properties.step"
      />
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useFormEngine} from "@/stores/formEngine.ts";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";
import {getLangText} from "@/locales/common.ts";

const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  }
}>()

const formEngine = useFormEngine()
const emit = defineEmits(['selected', 'update:modelValue'])
const {activeComponent} = storeToRefs(formEngine)
const {t, locale} = useI18n()
const testValue = ref(undefined)

function onComponentClick(ponent) {
  formEngine.setActiveComponent(ponent)
}

</script>
<style scoped>
</style>


